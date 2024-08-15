import type { UseFetchOptions } from 'nuxt/app';

export const useSpotifyFetch = <T>(
  url: string | (() => string),
  options?: UseFetchOptions<T, T>,
) => {
  const config = useRuntimeConfig();
  const tokenStore = useTokenStore();

  const authorization = computed(() => `Bearer ${tokenStore.accessToken}`);

  return useFetch(url, {
    ...options,
    baseURL: config.public.SPOTIFY_BASE_URI,
    headers: {
      Authorization: authorization,
    },
    onResponseError: () => {
      tokenStore.clear();
    },
  });
};
