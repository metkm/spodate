export const useTokenStore = defineStore('token', () => {
  const accessToken = ref('213');
  const refreshToken = ref('213');

  return {
    accessToken,
    refreshToken,
  };
}, {
  persist: true,
});
