/// <reference types="vite/client" />

// Our own env variables. Vite gives them as STRINGS, and a missing one is undefined.
interface ImportMetaEnv {
  readonly VITE_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
