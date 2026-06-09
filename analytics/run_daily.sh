#!/usr/bin/env bash
# Daily PDCA entry point — run from cron (or /schedule remote agent) at 09:00 KST.
#
# Pipeline:
#   1. Pull GA4 snapshot via Data API (preferred).
#   2. If API not configured, fall back to Playwright scraping.
#   3. Generate the markdown briefing for the Seth Godin lead.
#   4. Write a status line for the orchestrator (last line of stdout).
#
# Cron example (run as the user, not root, so brace expansion + zsh PATH work):
#   0 9 * * * cd /Users/paycis/project/kpop-idol-chemistry/analytics && ./run_daily.sh \
#     >> daily/run.log 2>&1
#
# Or as a launchd LaunchAgent: see analytics/com.kpopname.daily.plist (TODO).

set -euo pipefail
cd "$(dirname "$0")"

# Load local env vars if present
if [[ -f .env.local ]]; then
  set -a; source .env.local; set +a
fi

if [[ -f service-account.json && -n "${GA4_PROPERTY_ID:-}" ]]; then
  echo "[run_daily] Using GA Data API"
  node ga_client.mjs
else
  echo "[run_daily] Service account or GA4_PROPERTY_ID missing — falling back to scraper"
  node ga_scraper.mjs || {
    echo "[run_daily] Scraper failed. Aborting before brief."
    exit 1
  }
fi

# daily_brief.mjs exits with 2 if self-correction triggers fired
set +e
node daily_brief.mjs
brief_status=$?
set -e

today=$(date +%Y-%m-%d)
if [[ $brief_status -eq 2 ]]; then
  echo "STATUS: TRIGGERS_FIRED brief=meetings/briefings/${today}.md"
elif [[ $brief_status -eq 0 ]]; then
  echo "STATUS: OK brief=meetings/briefings/${today}.md"
else
  echo "STATUS: ERROR exit=${brief_status}"
  exit $brief_status
fi
