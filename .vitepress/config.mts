import { defineConfig } from "vitepress";
import mdItCustomAttrs from "markdown-it-custom-attrs";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/afan-blog/",
  title: "阿饭知识库",
  description: "记录编程学习",
  head: [
    // 网站icon
    ["link", { rel: "icon", href: "/afan-blog/logo.png" }],
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
    // 引入图片灯箱 js 和 css 文件
    [
      "script",
      {},
      `
        (function(){
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css";
          document.head.append(link);
          const script = document.createElement("script");
          script.defer = "";
          script.sync = "";
          script.src = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js";
          document.head.append(script);
        })()
      `,
    ],
  ],
  themeConfig: {
    search: {
      provider: "local",
    },
    outlineTitle: "文章标题",
    outline: [1, 6], // 定义标题级别,字符串"deep"相当于是[2,6]
    logo: "/logo.png",
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
  markdown: {
    config: (md) => {
      // use more markdown-it plugins!
      md.use(mdItCustomAttrs, "image", {
        "data-fancybox": "gallery",
      });
    },
    lineNumbers: true, //代码显示行号
    theme: {
      light: "one-dark-pro",
      dark: "one-dark-pro",
    },
  },
});
