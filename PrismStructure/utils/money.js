/**
 * Parse currency text from UI (e.g. "$45.00", "45.00") to a number.
 * @param {string} text
 * @returns {number}
 */
function parseMoney(text) {
  const normalized = String(text).replace(/[^0-9.,]/g, '').replace(/,/g, '');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : NaN;
}

module.exports = { parseMoney };
