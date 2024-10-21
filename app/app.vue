<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const query = useRouteQuery('q', '')
const tokenStore = useTokenStore()

const background = useState('background')

const handleClick = () => {
  navigateTo({
    name: 'index',
    query: {
      query: query.value,
    },
  })
}
</script>

<template>
  <main class="flex flex-col gap-4 min-h-screen max-w-4xl p-4 mx-auto text-sm">
    <NuxtLoadingIndicator />
    <ClientOnly v-if="background">
      <TheLight />
    </ClientOnly>

    <div class="flex gap-4 w-full">
      <TheLogin v-if="!tokenStore.accessToken" />
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search.."
        size="lg"
        class="grow"
        :disabled="!tokenStore.accessToken"
        @click="handleClick"
      />
    </div>

    <NuxtPage keepalive />
  </main>
</template>
