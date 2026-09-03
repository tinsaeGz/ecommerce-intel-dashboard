/* Generated from packages/design-tokens/tokens.json. Do not edit directly. */
export const designTokens = {
  "color": {
    "ink": "#10110e",
    "paper": "#fbfbf7",
    "white": "#fff",
    "mist": "#f0f2ec",
    "slate": "#596158",
    "line": "#d9ddd2",
    "lime": "#c9f54a",
    "mint": "#9be5c1",
    "aqua": "#9edfed",
    "lavender": "#cfc6ff"
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ],
    "serif": [
      "Source Serif 4",
      "Georgia",
      "serif"
    ]
  },
  "space": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "14": 56,
    "18": 72
  },
  "radius": {
    "control": 8,
    "card": 16,
    "panel": 24
  },
  "shadow": {
    "panel": "0 1.5rem 4rem rgb(16 17 14 / 10%)"
  }
} as const;

export type DesignTokens = typeof designTokens;
