<script setup lang="ts">
import { UButton, UContainer } from '#components'

definePageMeta({
  middleware: ['authenticated'],
})

const { clear: clearSession, user } = useUserSession()

async function logout(): Promise<void> {
  await clearSession()
  await navigateTo('/login', { replace: true })
}
</script>

<template>
  <UContainer>
    <h1>Welcome {{ user?.name }}</h1>
    <UButton
      @click="logout"
    >
      Logout
    </UButton>
  </UContainer>
</template>
