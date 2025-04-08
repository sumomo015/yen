import { eq } from 'drizzle-orm'

import { users } from '../schema'

const DELAY_TIME = 1000

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function delayRemainingTime(startTime: number): Promise<void> {
  const remainingTime = DELAY_TIME - (Date.now() - startTime)
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (remainingTime > 0) {
    await delay(remainingTime)
  }
}

async function throwBadCredentialsError(startTime: number): Promise<void> {
  await delayRemainingTime(startTime)
  throw createError({
    statusCode: 401,
    message: 'Bad credentials',
  })
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { username, password } = await readValidatedBody(event, loginFormSchema.parse)

  const [dbData] = await event.context.db.select({
    username: users.username,
    password: users.password,
    salt: users.salt,
  }).from(users).where(eq(users.username, username))

  if (!dbData) {
    await throwBadCredentialsError(startTime)
    return
  }

  const hashedPassword = await hashPasswordWithScrypt(password, dbData.salt)

  if (hashedPassword !== dbData.password) {
    await throwBadCredentialsError(startTime)
    return
  }

  await delayRemainingTime(startTime)

  await setUserSession(event, {
    user: {
      username: dbData.username,
    },
  })
  return {}
})
