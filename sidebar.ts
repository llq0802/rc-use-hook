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
          link: '/components/use-callback-state',
        },
        {
          title: 'useWorker-WebWorker',
          link: '/components/use-worker',
        },
        {
          title: 'useDeepUpdateEffect-深度比较更新',
          link: '/components/use-deep-update-effect',
        },
        {
          title: 'useLazyLoadImage-懒加载图片',
          link: '/components/use-lazy-load-image',
        },
      ],
    },
  ],
};
