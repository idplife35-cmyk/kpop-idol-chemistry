

/**
 * loader.js
 * Generic JSON loader for static site
 * Uses fetch() relative to the site root
 */

export async function loadJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to load ${url}: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error('loadJSON error', err);
    return null;
  }
}