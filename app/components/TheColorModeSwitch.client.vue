<script setup lang="ts">
const colorMode = useColorMode()

console.log(colorMode.preference, colorMode.value)
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
