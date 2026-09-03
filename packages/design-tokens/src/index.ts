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
    "lavender": "#cfc6ff",
    "amber": "#f2be4a",
    "coral": "#e9685a",
    "forest": "#286448",
    "blue": "#245e78"
  },
  "fontFamily": {
    "sans": [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ],
    "serif": [
      "ui-serif",
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
    "18": 72,
    "24": 96,
    "32": 128
  },
  "radius": {
    "control": 8,
    "card": 16,
    "panel": 24
  },
  "shadow": {
    "panel": "0 1.5rem 4rem rgb(16 17 14 / 10%)",
    "overlay": "0 1rem 3rem rgb(16 17 14 / 16%)"
  },
  "fontSize": {
    "caption": 12,
    "ui": 14,
    "body": 16,
    "body-large": 20,
    "heading": 22,
    "section": 40,
    "display": 72
  },
  "fontWeight": {
    "regular": 400,
    "medium": 500,
    "semibold": 650,
    "bold": 750
  },
  "lineHeight": {
    "display": 0.98,
    "heading": 1.12,
    "ui": 1.4,
    "body": 1.55
  },
  "motion": {
    "fast": 120,
    "panel": 200,
    "reveal": 520
  }
} as const;

export type DesignTokens = typeof designTokens;
