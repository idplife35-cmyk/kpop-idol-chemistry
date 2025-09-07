// /js/ui/dom.js
// Lightweight DOM helpers for the static site

/**
 * Query single element
 * @param {string} sel
 * @param {ParentNode} [root=document]
 */
export function q(sel, root = document) {
  return root.querySelector(sel);
}

/**
 * Add event listener
 * @param {Element|Window|Document} el
 * @param {string} ev
 * @param {(e:Event)=>void} fn
 */
export function on(el, ev, fn) {
  if (!el) return;
  el.addEventListener(ev, fn, false);
}

/**
 * Set innerHTML safely for our controlled templates
 * (Call sites must pass sanitized/escaped strings for user inputs)
 * @param {Element} el
 * @param {string} html
 */
export function setHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
}

/**
 * Announce text to screen readers via #live (aria-live=polite)
 * @param {string} text
 */
export function ariaLive(text) {
  const live = document.getElementById('live');
  if (live) {
    live.textContent = text || '';
  }
}