export const useTokenStore = defineStore('token', () => {
  const accessToken = ref('')
  const refreshToken = ref('')

  const clear = () => {
    console.log('clear toklens triggered')
    accessToken.value = ''
    refreshToken.value = ''
  }

  return {
    accessToken,
    refreshToken,
    clear,
  }
}, {
  persist: true,
})
