import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  title: "阿饭知识库",
  description: "记录编程学习",
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      // { text: '学习', link: '/study' },
      { text: '开发日志', link: '/log' }
    ],

    sidebar: {
      // '/study': [
      //   {
      //     text: '学习',
      //     items: [
      //       { text: 'Vue3', link: '/study/vue3/index' },
      //       { text: 'Nest.js', link: '/study/nestjs/index' }
      //     ]
      //   }
      // ]
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
