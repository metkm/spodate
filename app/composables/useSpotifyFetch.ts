import type { UseFetchOptions } from 'nuxt/app'

export const useSpotifyFetch = <T>(
  url: string | (() => string),
  options?: Omit<UseFetchOptions<T>, 'default'>,
) => {
  const config = useRuntimeConfig()
  const { accessToken } = useTokenStore()

  return useFetch(url, {
    ...options,
    baseURL: config.public.SPOTIFY_BASE_URI,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
