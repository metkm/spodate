import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig> {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: _routes => [
    ..._routes,
  ],
  scrollBehavior: (to, _, savedPosition) => {
    if (to.name === 'playlist-id') {
      return { top: 0 };
    }

    return savedPosition;
  },
};
