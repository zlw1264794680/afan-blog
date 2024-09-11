import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/afan-blog/",
  title: "阿饭知识库",
  description: "记录编程学习",
  head: [
    // 网站icon
    ["link", { rel: "icon", href: "/logo.svg" }],
    // 注入百度统计代码
    [
      "script",
      {},
      `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?5d507b656744ea7a259892fa92ab442b";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();`,
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      // { text: '学习', link: '/study' },
      { text: "开发日志", link: "/log" },
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
    ],
  },
});
