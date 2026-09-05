import { landingDemo } from "./demo-data";

// Fictional aggregates at the shared sample day's cutoff. Money uses cents.
export const salesComparison = [
  { product: "tote", currentCents: 480_000, previousCents: 360_000 },
  { product: "coffee", currentCents: 360_000, previousCents: 300_000 },
  { product: "other", currentCents: 408_000, previousCents: 397_627 },
] as const;

export const coffeeStock = { observed: 50, deliveries: 10, sold: 48, dailyPace: 6 } as const;
export const sampleStock = coffeeStock.observed + coffeeStock.deliveries - coffeeStock.sold;

// Fictional stable identifiers, never real customer data.
export const customerHistory = {
  today: Array.from({ length: landingDemo.customers }, (_, index) => `sample-${index + 1}`),
  earlier: Array.from({ length: landingDemo.returningCustomers }, (_, index) => `sample-${index + 1}`),
};
export const returningCount = customerHistory.today.filter(id => customerHistory.earlier.includes(id)).length;
