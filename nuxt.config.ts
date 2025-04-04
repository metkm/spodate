// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    'pinia-plugin-persistedstate/nuxt',
    'motion-v/nuxt',
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    SPOTIFY_CLIENT_SECRET: '',
    public: {
      SPOTIFY_CLIENT_ID: '',
      SPOTIFY_REDIRECT_URI: '',
      SPOTIFY_BASE_URI: '',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    typedPages: true,
  },
  compatibilityDate: '2024-04-03',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
