import { defineConfig } from 'dumi';
import sidebar from './sidebar';

export default defineConfig({
  outputPath: 'docs-dist',
  resolve: {
    atomDirs: [{ type: 'hooks', dir: 'src' }],
  },
  // https: {},
  themeConfig: {
    name: 'rc-use-hook',
    nav: [
      { title: '指南', link: '/guide' },
      { title: 'hooks', link: '/hooks' },
      {
        title: 'Lighting Design',
        link: 'https://llq0802.github.io/lighting-design/latest/',
      },
      {
        title: 'GitHub',
        link: 'https://github.com/llq0802/rc-use-hook',
      },
    ],
    sidebar,
  },
});
