// Env values are STRINGS ("true", "false") or undefined when the line is missing.
// Compare with the exact string: "false", a typo or a missing line all mean OFF.
// import.meta.env.DEV is Vite's built-in boolean: mocks can never turn on in a production build.
export const MOCKS_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_MOCKS === "true";
