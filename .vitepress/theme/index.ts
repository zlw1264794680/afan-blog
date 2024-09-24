// https://vitepress.dev/guide/custom-theme
import { h, nextTick } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import { onMounted } from "vue";
import mediumZoom from "medium-zoom";
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    onMounted(() => {
      // 避免部分图片无法显示
      nextTick(() => {
        /**
         * 需要手动显示开启，否则图片无法放大
         * ![](path/to/file.jpg){data-zoomable}
         */
        // mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" })
        setTimeout(() => {
          // 全部开启
          mediumZoom("img", { background: "var(--vp-c-bg)" });
        }, 1000);
      });
    });
  },
} satisfies Theme;
