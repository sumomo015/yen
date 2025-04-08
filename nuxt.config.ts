/* eslint-disable @typescript-eslint/no-magic-numbers */

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/robots',
    'nuxt-auth-utils',
    '@nuxtjs/html-validator',
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  router: {
    options: { scrollBehaviorType: 'smooth' },
  },
  site: {
    indexable: false,
  },
  future: {
    compatibilityVersion: 4,
  },
  typescript: {
    tsConfig: { compilerOptions: { noUncheckedIndexedAccess: true } },
  },
  fonts: {
    families: [
      { name: 'Noto Sans JP', weights: [400, 500, 600, 700], styles: ['normal', 'italic'] },
    ],
  },
  runtimeConfig: {
    session: {
      name: 'session',
      password: '',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      cookie: {
        sameSite: 'lax',
      },
    },
    postgres: {
      url: '',
    },
    cloudsql: {
      connectionName: '',
      isPrivateIp: false,
      database: '',
      user: '',
    },
  },
  $production: {
    runtimeConfig: {
      session: {
        name: '__Host-session',
        password: process.env.NUXT_SESSION_PASSWORD ?? '',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        cookie: {
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
        },
      },
    },
  },
})
