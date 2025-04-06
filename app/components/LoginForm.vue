<script setup lang="ts">
import { UIcon, UForm, UFormField, UInput, UButton, UAlert } from '#components'

import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  loading?: boolean
  errorType?: LoginFormErrorType
}>()
const emit = defineEmits<{
  submit: [LoginFormSchema]
}>()

const state = reactive<Partial<LoginFormSchema>>({
  username: undefined,
  password: undefined,
})

function onSubmit(event: FormSubmitEvent<LoginFormSchema>): void {
  emit('submit', {
    username: event.data.username,
    password: event.data.password,
  })
}

const errorMsg = computed<string | undefined>(() => {
  const errorMsgMap: Record<LoginFormErrorType, string> = {
    'invalid-credentials': 'ユーザー名またはパスワードが間違っています。',
    'rate-limit': 'リクエストが多すぎます。しばらくしてから再試行してください。',
    'unknown': '不明なエラーが発生しました。',
  }
  return props.errorType ? errorMsgMap[props.errorType] : undefined
})
</script>

<template>
  <div class="rounded-[calc(var(--ui-radius)*2)] bg-(--ui-bg) ring ring-(--ui-border) p-4 sm:p-6">
    <div class="mb-2 text-center">
      <UIcon
        name="i-lucide:user"
        class="size-8"
      />
    </div>

    <div class="text-center text-xl font-semibold text-(--ui-text-highlighted) mb-1">
      ログイン
    </div>

    <p class="text-center text-base text-(--ui-text-muted) text-pretty mb-6">
      ユーザー名とパスワードを入力してください。
    </p>

    <UForm
      :schema="loginFormSchema"
      :state="state"
      :disabled="$props.loading"
      class="space-y-5"
      @submit="onSubmit"
    >
      <UFormField
        label="ユーザー名"
        name="username"
        required
      >
        <UInput
          v-model="state.username"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="パスワード"
        name="password"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="errorMsg"
        color="error"
        :title="errorMsg"
        icon="i-lucide:alert-triangle"
      />

      <UButton
        type="submit"
        class="w-full justify-center"
        trailing-icon="i-lucide:arrow-right"
        :loading="$props.loading"
      >
        ログイン
      </UButton>
    </UForm>
  </div>
</template>
