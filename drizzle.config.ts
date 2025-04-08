import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const POSTGRES_URL = process.env.NUXT_POSTGRES_URL

if (!POSTGRES_URL) {
  throw new Error('Please set the NUXT_POSTGRES_URL environment variable')
}

export default defineConfig({
  out: './drizzle',
  schema: './server/schema/*',
  dialect: 'postgresql',
  strict: true,
  dbCredentials: {
    url: POSTGRES_URL,
  },
})
