import 'dotenv/config'
import { defineCommand, runMain } from 'citty'

import { users } from '~~/server/schema'
import { getDatabaseClient, hashPasswordWithScrypt } from '~~/server/utils'

const POSTGRES_URL = process.env.NUXT_POSTGRES_URL

if (!POSTGRES_URL) {
  throw new Error('Please set the NUXT_POSTGRES_URL environment variable')
}

const db = await getDatabaseClient({
  type: 'url',
  url: POSTGRES_URL,
})

const main = defineCommand({
  meta: {
    name: 'addUser',
    version: '1.0.0',
    description: 'Add a new user to the database',
  },
  args: {
    username: {
      type: 'string',
      required: true,
      description: 'The username of the new user',
      valueHint: 'USERNAME',
      alias: ['u'],
    },
    password: {
      type: 'string',
      required: true,
      description: 'The password of the new user',
      valueHint: 'PASSWORD',
      alias: ['p'],
    },
  },
  async run({ args }) {
    const { username, password } = args

    const { hash, salt } = await hashPasswordWithScrypt(password)

    const issertedUser = await db.insert(users).values({
      username,
      password: hash,
      salt,
    }).returning()

    console.log(`User ${username} added to the database`)
    console.log(issertedUser)
  },
})

void runMain(main)
