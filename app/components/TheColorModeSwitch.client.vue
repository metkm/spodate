<script setup lang="ts">
const colorMode = useColorMode()

const isDarkMode = ref(colorMode.value === 'dark' ? true : false)

const toggleMode = () => {
  colorMode.preference = isDarkMode.value ? 'dark' : 'light'
}
</script>

<template>
  <USwitch
    v-model="isDarkMode"
    :label="`${colorMode.value} mode`"
    @change="toggleMode"
  />
</template>
