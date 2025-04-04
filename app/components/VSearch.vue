<script setup lang="ts">
import { motion } from 'motion-v'

const modelValue = defineModel<string>()

defineProps<{
  isLoading?: boolean
}>()
</script>

<template>
  <motion.div
    layout
    class="flex bg-(--ui-bg-elevated)/50 rounded-full hover:bg-(--ui-bg-elevated) grow relative ps-7"
  >
    <div
      class="flex items-center start-0 absolute inset-y-0 ps-3 text-(--ui-text-dimmed)"
    >
      <svg
        v-if="isLoading"
        class="animate-spin size-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <UIcon
        v-else
        name="i-heroicons-magnifying-glass"
        class="size-5"
      />
    </div>

    <motion.div
      layout="position"
      class="flex grow"
    >
      <input
        v-model="modelValue"
        class=" px-4 py-2 grow placeholder:text-(--ui-text-dimmed) focus:outline-none"
        placeholder="write here"
        v-bind="$attrs"
      >
    </motion.div>
  </motion.div>
</template>
