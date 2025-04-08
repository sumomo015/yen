import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

// auth.d.ts
declare module '#auth-utils' {
  interface User {
    username: string
  }
}

declare module 'h3' {
  interface H3EventContext {
    db: NodePgDatabase
  }
}

export {}
