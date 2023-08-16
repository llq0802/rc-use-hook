import { defineConfig } from 'dumi';
import sidebar from './sidebar';
const isDev = process.env.NODE_ENV === 'development';

const publicPath = !isDev ? `/rc-use-hook/` : '/';
const logo = `${publicPath}logo.png`;
const favicons = [`${publicPath}logo.png`];

export default defineConfig({
  // https: {},
  outputPath: 'docs-dist',
  favicons,
  publicPath,
  base: publicPath,
  logo,
  resolve: {
    atomDirs: [{ type: 'hooks', dir: 'src' }],
  },
  themeConfig: {
    name: 'rc-use-hooks',
    rtl: true,
    sidebar,
    footer:
      'Open-source MIT Licensed | Copyright © 2020-present Powered by llq0802',
    socialLinks: {
      github: 'https://github.com/llq0802',
    },
    nav: [
      { title: '指南', link: '/guide' },
      { title: 'HOOKS', link: '/hooks' },
      {
        title: '组件库',
        link: 'https://llq0802.github.io/lighting-design/latest/',
      },
      {
        title: 'GitHub',
        link: 'https://github.com/llq0802/rc-use-hooks',
      },
    ],
  },
  metas: [
    {
      name: 'keywords',
      content: 'hook, use-hook, rc-use-hooks, hooks, react-hook',
    },
    {
      name: 'description',
      content: '🍙 让中后台开发更简单',
    },
  ],
  styles: [
    `
    .dumi-default-sidebar {
      min-width: 260px;
    }
    .dumi-default-previewer-demo {
      min-height: 60px;
      display: flex;
      overflow: auto;
      flex-direction: column;
      justify-content: center;
    }
    .dumi-default-content-tabs{
      margin: -24px -48px 48px !important;
    }

    .dumi-default-header:not([data-static]){
      border-bottom: 1px solid #ddd;
    }
    .dumi-default-header-left {
      min-width: 230px;
      margin-right: 32px;
    }
    .dumi-default-header-left .dumi-default-logo{
      color: #5581a6
    }
    .dumi-default-header .dumi-default-header-content{
      max-width: initial;
      padding:0 50px;
    }

   #root .dumi-default-doc-layout > main{
      max-width: initial;
      padding:0 50px;
    }
    main .dumi-default-sidebar{
      width:300px
    }
  `,
  ],
});
