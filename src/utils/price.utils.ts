const PRICE_PATTERN = /-?\$?(\d+(?:\.\d+)?)/;

export function parsePrice(value: string): number {
  const amount = PRICE_PATTERN.exec(value)?.[1];

  if (amount === undefined) {
    throw new Error(`Could not parse price from "${value}".`);
  }

  return Number(amount);
}

export function sumPrices(prices: readonly number[]): number {
  const totalInCents = prices.reduce((total, price) => total + Math.round(price * 100), 0);

  return totalInCents / 100;
}

export function calculateTotalWithTax(itemTotal: number, tax: number): number {
  return sumPrices([itemTotal, tax]);
}
