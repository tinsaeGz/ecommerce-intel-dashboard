# Design tokens

`tokens.json` is the platform-neutral visual source for web and native clients.
The generator emits typed values for React Native and CSS custom properties for
`apps/web`; platform-specific components and styling remain inside each app.

Run `npm run generate:tokens` after changing token values. Do not edit generated
files directly.
