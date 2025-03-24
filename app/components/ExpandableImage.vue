<script setup lang="ts">
defineProps<{
  src: string
}>()

const triggerContainer = useTemplateRef('triggerContainer')
const overlayContainer = useTemplateRef('overlayContainer')

const opened = ref(false)
const containerStyle = ref({})

onClickOutside(triggerContainer, () => {
  opened.value = false
})

const waitAnimationFrame = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve()
    })
  })
}

const toStyle = (rect: DOMRect) => {
  return {
    x: rect.x,
    y: rect.y,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    right: `${rect.right}px`,
    top: `${rect.top}px`,
    bottom: `${rect.bottom}px`,
  }
}

const handleOpen = async () => {
  if (!triggerContainer.value) return

  const fromRect = triggerContainer.value.getBoundingClientRect()

  opened.value = true
  await nextTick()
  await waitAnimationFrame()

  if (!overlayContainer.value) return
  const toRect = overlayContainer.value?.getBoundingClientRect()

  containerStyle.value = toStyle(fromRect)

  await nextTick()
  await waitAnimationFrame()

  containerStyle.value = {
    ...toStyle(toRect),
    'transition-property': 'all',
    'transition-timing-function': 'var(--default-transition-timing-function)',
    'transition-duration': '350ms',
  }
}
</script>

<template>
  <button @click="handleOpen">
    <div ref="triggerContainer">
      <slot />
    </div>
  </button>

  <Teleport to="body">
    <Transition
      appear
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-all"
      leave-active-class="transition-all"
    >
      <div
        v-if="opened"
        class="fixed z-50 inset-0 bg-black/50"
      >
        <div class="relative flex items-center justify-center h-full w-full">
          <div
            ref="overlayContainer"
            class="absolute w-full max-w-2xl aspect-square"
            :style="containerStyle"
          >
            <img
              :src="src"
              class="object-cover mx-auto w-full h-full"
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
