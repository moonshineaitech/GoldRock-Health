/** Exact USD parsing: no binary-float multiplication and no silent OCR corrections. */
export function parseMoneyToCents(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') throw new TypeError('Enter the amount as text.');
  const clean = value.trim().replace(/^\$\s?/, '');
  if (!/^(?:0|[1-9][0-9]*|[1-9][0-9]{0,2}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?$/.test(clean)) throw new RangeError('Use dollars and at most two decimal places.');
  const [whole, fraction = ''] = clean.replaceAll(',', '').split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (cents > 1_000_000_000n) throw new RangeError('Amount exceeds the supported range.');
  return Number(cents);
}
export function formatMoney(cents) {
  if (cents === null || cents === undefined) return 'Not entered';
  if (!Number.isSafeInteger(cents)) throw new TypeError('Amount must use integer cents.');
  // Dividing a large safe integer by 100 can lose its final cent before formatting.
  // The product uses USD/en-US; format the integer digits without a float conversion.
  const digits = String(Math.abs(cents)).padStart(3, '0');
  const dollars = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${cents < 0 ? '-' : ''}$${dollars}.${digits.slice(-2)}`;
}
export function sumMoney(values) {
  if (!Array.isArray(values) || values.some(value => !Number.isSafeInteger(value))) throw new TypeError('All amounts must use integer cents.');
  const result = values.reduce((sum, value) => sum + BigInt(value), 0n);
  if (result > BigInt(Number.MAX_SAFE_INTEGER) || result < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError('Money total exceeds safe integer range.');
  return Number(result);
}
