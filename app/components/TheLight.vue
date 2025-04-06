<script setup lang="ts">
const background = useState('background', () => '')
</script>

<template>
  <div class="absolute inset-28 -z-10 blur-[150px] opacity-20">
    <Transition
      v-if="background"
      enter-active-class="transition-all duration-500"
      leave-active-class="transition-all duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
      appear
    >
      <img
        :key="background"
        :src="background"
        class="w-full h-full object-cover"
      >
    </Transition>
  </div>
</template>
