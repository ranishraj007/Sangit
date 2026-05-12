/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_MUSIC_API_DOMAIN?: string;
  }
}

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_MUSIC_API_DOMAIN?: string;
}
