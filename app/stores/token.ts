export const useTokenStore = defineStore('token', () => {
  const accessToken = ref('')
  const refreshToken = ref('')

  const clear = () => {
    accessToken.value = ''
    refreshToken.value = ''
  }

  return {
    accessToken,
    refreshToken,
    clear,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    // storage: piniaPluginPersistedstate.cookies({
    //   maxAge: 604800,
    // }),
  },
})
