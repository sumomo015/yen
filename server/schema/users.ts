import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
})

export {
  users,
}
