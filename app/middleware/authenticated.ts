export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return await navigateTo('/login', { replace: true })
  }
})
