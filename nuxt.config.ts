// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-typed-router',
    '@nuxt/ui',
  ],
  runtimeConfig: {
    SPOTIFY_CLIENT_SECRET: '',
    public: {
      SPOTIFY_CLIENT_ID: '',
      SPOTIFY_REDIRECT_URI: '',
      SPOTIFY_BASE_URI: '',
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  experimental: {
    viewTransition: true,
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: './tailwind.config.ts',
  },
  future: {
    compatibilityVersion: 4,
  },
});
