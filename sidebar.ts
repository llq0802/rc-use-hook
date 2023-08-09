export default {
  '/hooks': [
    {
      children: [
        {
          title: ' HOOKS 总览',
          link: '/hooks',
        },
      ],
    },
    {
      title: 'Hooks',
      children: [
        {
          title: 'useShow-父子组件传参',
          link: '/hooks/use-Show',
        },
        {
          title: 'useCallbackState-状态更新回调',
          link: '/hooks/use-callback-state',
        },
        {
          title: 'useWorker-WebWorker',
          link: '/hooks/use-worker',
        },
        {
          title: 'useDeepUpdateEffect-深度比较更新',
          link: '/hooks/use-deep-update-effect',
        },
        {
          title: 'useLazyLoadImage-懒加载图片',
          link: '/hooks/use-lazy-load-image',
        },
        {
          title: 'useWindowSize',
          link: '/hooks/use-Window-Size',
        },
        {
          title: 'useBeforeUnload',
          link: '/hooks/use-Before-Unload',
        },
        {
          title: 'useGeolocation',
          link: '/hooks/use-Geolocation',
        },
      ],
    },
  ],
};
