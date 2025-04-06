<script setup lang="ts">
import { FetchError } from 'ofetch'

import { LoginForm, UContainer } from '#components'

definePageMeta({
  middleware: ['guest'],
})

useHead({
  title: 'ログイン',
})

const { fetch: refreshSession } = useUserSession()

const STATUS_CODE = {
  INVALID_CREDENTIALS: 401,
  RATE_LIMIT: 429,
}

const loading = ref<boolean>(false)
const errorType = ref<LoginFormErrorType | undefined>(undefined)

async function handleLogin(data: LoginFormSchema): Promise<void> {
  loading.value = true
  errorType.value = undefined
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: data,
    })
    await refreshSession()
    await navigateTo('/', { replace: true })
  }
  catch (error) {
    if (!(error instanceof FetchError)) {
      errorType.value = 'unknown'
      return
    }
    switch (error.status) {
      case STATUS_CODE.INVALID_CREDENTIALS:
        errorType.value = 'invalid-credentials'
        break
      case STATUS_CODE.RATE_LIMIT:
        errorType.value = 'rate-limit'
        break
      default:
        errorType.value = 'unknown'
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="max-w-110">
    <img
      src="/icon.svg"
      alt="logo"
      class="mx-auto size-20 mt-8 mb-6"
    >
    <LoginForm
      :loading="loading"
      :error-type="errorType"
      @submit="handleLogin"
    />
  </UContainer>
</template>
