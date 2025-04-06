import { z } from 'zod'

const REQUIRED_LENGTH = 1

const schema = z.object({
  username: z.string({
    required_error: 'ユーザー名は必須です。',
  }).min(REQUIRED_LENGTH, 'ユーザー名は必須です。'),
  password: z.string({
    required_error: 'パスワードは必須です。',
  }).min(REQUIRED_LENGTH, 'パスワードは必須です。'),
})

type Schema = z.output<typeof schema>

type ErrorType = 'invalid-credentials' | 'rate-limit' | 'unknown'

export {
  schema as loginFormSchema,
}

export type {
  Schema as LoginFormSchema,
  ErrorType as LoginFormErrorType,
}
