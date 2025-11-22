/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Sui Network
  readonly VITE_SUI_NETWORK: string
  
  // zkLogin OAuth
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_CLIENT_ID: string
  readonly VITE_TWITCH_CLIENT_ID: string
  readonly VITE_REDIRECT_URI: string
  
  // Twitch OAuth (nouvelle config)
  readonly NEXT_PUBLIC_TWITCH_CLIENT_ID: string
  readonly TWITCH_CLIENT_SECRET: string
  readonly NEXT_PUBLIC_TWITCH_REDIRECT_URI: string
  
  // API
  readonly VITE_API_URL: string
  
  // zkLogin
  readonly VITE_ZKLOGIN_PROVER_URL: string
  readonly VITE_ZKLOGIN_SALT_SERVICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
