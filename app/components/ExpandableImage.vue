<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
  holdKey?: string
  src?: string
}>()

const mouseOver = ref(false)
const pressingHoldKey = ref(false)

const shouldExpand = computed(() => mouseOver.value && pressingHoldKey.value)

onMounted(() => {
  useEventListener('keydown', (event) => {
    if (event.key != props.holdKey) return
    pressingHoldKey.value = true
  })

  useEventListener('keyup', (event) => {
    if (event.key != props.holdKey) return
    pressingHoldKey.value = false
    mouseOver.value = false
  })
})
</script>

<template>
  <div
    @mouseenter="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    <AnimatePresence>
      <motion.div
        v-if="shouldExpand"
        class="fixed inset-y-10 aspect-square"
        :exit="{ opacity: 0 }"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
      >
        <motion.img
          :src="src"
          class="w-full h-full object-cover rounded"
          :layout-id="`image-${src}`"
          layout
        />
      </motion.div>
      <motion.img
        v-else
        :layout-id="`image-${src}`"
        layout
        :exit="{ opacity: 0 }"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :src="src"
        class="w-full h-full object-cover rounded"
      />
    </AnimatePresence>
  </div>
</template>
