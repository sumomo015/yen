export default defineEventHandler(async (event) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { username, password } = await readValidatedBody(event, loginFormSchema.parse)

  if (username === 'sumomo015' && password === 'sumomo015') {
    await setUserSession(event, {
      user: {
        name: 'sumomo015',
      },
    })
    return {}
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials',
  })
})
