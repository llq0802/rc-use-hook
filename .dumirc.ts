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
        title: 'GitHub',
        link: 'https://github.com/llq0802/lighting-design/tree/v2',
      },
    ],
    sidebar,
  },
});
