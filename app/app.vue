<script setup lang="ts">
import { ja } from '@nuxt/ui/locale'

import { NuxtRouteAnnouncer, NuxtPage, UApp } from '#components'

useHead({
  titleTemplate: (titleChunk?: string): string => titleChunk ? `${titleChunk} - YEN` : 'YEN',
})
</script>

<template>
  <UApp :locale="ja">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
