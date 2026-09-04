export const landingDemo = {
  workspace: "Mercado Norte",
  date: new Date("2026-09-03T12:00:00Z"),
  timeZone: "Europe/Madrid",
  currency: "EUR",
  revenue: 12_480,
  transactions: 312,
  units: 468,
  customers: 241,
  returningCustomers: 38,
  comparisonPercent: 18,
  stockRisks: 3,
  stockRiskItems: [
    { name: "Ground Coffee", daysRemaining: 2 },
    { name: "Canvas Tote", daysRemaining: 4 },
    { name: "Ceramic Cup", daysRemaining: 6 },
  ],
  sources: 4,
  freshnessMinutes: 2,
  chart: {
    current: [0, 1_240, 2_860, 4_120, 6_740, 8_360, 10_240, 12_480],
    previous: [0, 980, 2_100, 3_520, 5_380, 7_180, 8_920, 10_576.27],
  },
} as const;

export type LandingDemo = typeof landingDemo;
