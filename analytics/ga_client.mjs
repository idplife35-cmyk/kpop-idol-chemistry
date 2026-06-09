#!/usr/bin/env node
/**
 * GA4 Data API client — pulls the daily snapshot used by analytics/daily_brief.mjs.
 *
 * Setup (one-time):
 *   1. Google Cloud Console → enable "Google Analytics Data API"
 *   2. Create a service account → download JSON key as analytics/service-account.json
 *   3. GA4 Admin (property G-K3G6XK3SXW) → Property access → add the service account
 *      email with "Viewer" role
 *   4. cd analytics && npm install
 *
 * Usage:
 *   GA4_PROPERTY_ID=123456789 node ga_client.mjs
 *   (or write GA4_PROPERTY_ID into analytics/.env.local before running)
 *
 * The numeric property ID lives in GA4 Admin → Property Settings → "Property ID".
 * It is NOT the G-XXXX measurement ID.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
if (!PROPERTY_ID) {
  console.error('GA4_PROPERTY_ID env var required (numeric property ID, not G-XXXX).');
  console.error('Find it in GA4 Admin → Property Settings → Property ID.');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'service-account.json');
}

const client = new BetaAnalyticsDataClient();
const property = `properties/${PROPERTY_ID}`;

async function runReport(spec) {
  const [response] = await client.runReport({ property, ...spec });
  return response;
}

function rowsToObjects(report) {
  const dims = (report.dimensionHeaders ?? []).map((h) => h.name);
  const mets = (report.metricHeaders ?? []).map((h) => h.name);
  return (report.rows ?? []).map((row) => {
    const out = {};
    (row.dimensionValues ?? []).forEach((v, i) => {
      out[dims[i]] = v.value;
    });
    (row.metricValues ?? []).forEach((v, i) => {
      out[mets[i]] = Number(v.value);
    });
    return out;
  });
}

async function pullSnapshot() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`[ga_client] Pulling 7-day window ending ${today}…`);

  const dateRange = [{ startDate: '7daysAgo', endDate: 'today' }];

  const [headline, byCountry, byEvent, byLanguage, conversionEvents] = await Promise.all([
    runReport({
      dateRanges: dateRange,
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'sessions' },
        { name: 'engagementRate' },
        { name: 'userEngagementDuration' },
      ],
    }),
    runReport({
      dateRanges: dateRange,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      limit: 25,
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    }),
    runReport({
      dateRanges: dateRange,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      limit: 50,
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    runReport({
      dateRanges: dateRange,
      dimensions: [{ name: 'language' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      limit: 25,
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    }),
    runReport({
      dateRanges: dateRange,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'conversions' }, { name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'isConversionEvent',
          stringFilter: { value: 'true' },
        },
      },
    }),
  ]);

  const snapshot = {
    pulled_at: new Date().toISOString(),
    window: '7daysAgo..today',
    property_id: PROPERTY_ID,
    headline: rowsToObjects(headline)[0] ?? {},
    by_country: rowsToObjects(byCountry),
    by_event: rowsToObjects(byEvent),
    by_language: rowsToObjects(byLanguage),
    conversion_events: rowsToObjects(conversionEvents),
  };

  const dailyDir = path.join(__dirname, 'daily');
  await fs.mkdir(dailyDir, { recursive: true });
  const outPath = path.join(dailyDir, `${today}.json`);
  await fs.writeFile(outPath, JSON.stringify(snapshot, null, 2));
  console.log(`[ga_client] Wrote ${outPath}`);
  return snapshot;
}

pullSnapshot().catch((err) => {
  console.error('[ga_client] FAILED:', err.message);
  if (err.code === 7 || /PERMISSION_DENIED/.test(String(err))) {
    console.error('Hint: did you add the service account email to GA4 property access?');
  }
  process.exit(1);
});
