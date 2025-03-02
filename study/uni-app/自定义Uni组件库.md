# 自定义Uni组件库

基于工作设计开发的组件库，目前主要兼容微信小程序。

## FreeNavBar导航栏

```vue
<template>
  <view class="font-500" :style="{
    fontSize: fontSize,
    height: appStore.customBarHeight + 'px',
  }">
    <view class="flex gap-2 bg-common w-full box-border" :class="[isFixed && 'fixed z-9999']" :style="{
      ...contentStyle,
      paddingTop: appStore.statusBarHeight + 'px',
      height: appStore.customBarHeight + 'px',
    }">
      <!-- 左侧 -->
      <view class="center justify-start w-250 pl-2 box-border">
        <!-- 返回按钮 -->
        <view v-if="(noLimitBack || _pages > 1) && isBack" @click="onBack" class="w-40 h-40 center">
          <uni-icons :color="iconAttr.color" type="left" size="20"></uni-icons>
        </view>
        <!-- 返回首页按钮 -->
        <view v-if="(noLimitHome || _pages === 1) && isHome" @click="onBackHome" class="w-40 h-40 center">
          <uni-icons :color="iconAttr.color" type="home" size="20"></uni-icons>
        </view>
        <slot name="left"> </slot>
      </view>
      <!-- 中间 -->
      <view class="grow-1 center overflow-hidden">
        <text class="overflow-hidden text-ellipsis whitespace-nowrap">
          {{ title }}
        </text>
      </view>
      <!-- 右侧 -->
      <view class="center w-250 pr-2 box-border">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>
<script setup>
import config from "@/config/config.mjs";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app";
const appStore = useAppStore();

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: config.title
  },
  // 默认字体大小
  fontSize: {
    type: String,
    default: "32rpx",
  },
  // 是否固定
  isFixed: {
    type: Boolean,
    default: true,
  },
  // 是否显示返回按钮
  isBack: {
    type: Boolean,
    default: true,
  },
  // 不限制返回按钮显示
  noLimitBack: {
    type: Boolean,
    default: false,
  },
  // 是否显示返回首页按钮
  isHome: {
    type: Boolean,
    default: true,
  },
  // 不限制返回首页按钮显示
  noLimitHome: {
    type: Boolean,
    default: false,
  },
  // 导航栏样式
  contentStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  // 图标属性
  iconAttr: {
    type: Object,
    default() {
      return {
        color: 'var(--gs-text-color-5)'
      };
    },
  },
  // 是否阻止默认返回
  preventDefaultBack: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back", "backHome"]);

// 当前页面栈数量
const _pages = ref(0);
onMounted(() => {
  // 获取当前页面栈数量
  _pages.value = getCurrentPages().length;
});

// 触发返回上一级路由
const onBack = () => {
  emit('back')
  if (!props.preventDefaultBack && _pages.value > 1) {
    uni.navigateBack();
  }
};

// 触发返回首页
const onBackHome = () => {
  emit('backHome')
  uni.reLaunch({ url: "/pages/index" });
};
</script>
<style lang="scss" scoped></style>
```

## FreeLoading加载器

```vue
<template>
  <view class="center flex-col gap-2" :style="{
    padding: padding.join(' '),
  }">
    <view class="loader" :style="{
      width:size
    }"></view>
    <view v-if="text" class="font-500">{{ text }}</view>
  </view>
</template>
<script setup>
const props = defineProps({
  padding: {
    type: Array,
    default() {
      return [0, 0, 0, 0];
    },
  },
  text: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: '100rpx'
  }
});
</script>
<style lang="scss" scoped>
// 圆圈加载
.loader {
  width: 100rpx;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--gs-primary-6) 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, var(--gs-primary-6));
  -webkit-mask: radial-gradient(farthest-side,
      #0000 calc(100% - 12rpx),
      #000 0);
  animation: l13 1s infinite linear;
}

@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
```

## 手写签名

<https://ext.dcloud.net.cn/plugin?id=4354>

### 二次封装手写签名页面 signature

```json
{
  "path": "signature/index",
  "style": {
    "navigationBarTitleText": "手写签名",
    "pageOrientation": "landscape" // 横屏旋转
  }
}
```

```vue
<template>
  <view
    class="w-100vw h-100vh bg-fill-1 fixed z-99999 top-0 left-0 flex items-stretch justify-between p-4 box-border gap-4"
  >
    <view
      class="w-[calc(100vw-100rpx)] flex-1 shadow-1 bg-common rounded-[24rpx]"
    >
      <l-signature
        ref="signatureRef"
        disableScroll
        preferToDataURL
        class="size-full"
      ></l-signature>
    </view>
    <view class="shrink-0 w-60 center flex-col gap-4">
      <button
        class="btn h-40 !text-size-[12rpx]"
        hover-class="btn-hover"
        @click="onBack"
      >
        返回
      </button>
      <button
        class="btn h-40 !text-size-[12rpx]"
        hover-class="btn-hover"
        @click="onClear"
      >
        清空
      </button>
      <button
        class="primary-btn h-40 !text-size-[12rpx]"
        hover-class="primary-btn-hover"
        @click="onConfirm"
      >
        确认
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const signatureRef = ref();

// 确认
const onConfirm = () => {
  signatureRef.value?.canvasToTempFilePath({
    success: (res) => {
      if (res.isEmpty) return uni.$gs.showToast({ title: "请完成签名" });
      uni.$emit("signatureConfirm", res.tempFilePath);
      onBack();
    },
  });
};

// 清空
const onClear = () => {
  signatureRef.value?.clear();
};

// 返回
const onBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped></style>

```

### 二次封装手写签名组件 FreeSignatureModal

> 如果需要屏幕横屏旋转，推荐使用手写签名页面的

```vue
<template>
  <view
    v-show="show"
    class="w-100vw h-100vh bg-fill-1 fixed z-99999 top-0 left-0 flex items-stretch justify-between p-4 box-border gap-4"
  >
    <view
      class="w-[calc(100vw-100rpx)] flex-1 shadow-1 bg-common rounded-[24rpx]"
    >
      <l-signature
        v-if="signatureShow"
        ref="signatureRef"
        disableScroll
        class="size-full"
      ></l-signature>
    </view>
    <view class="shrink-0 w-60 center flex-col gap-4">
      <button
        class="btn h-40 !text-size-[12rpx]"
        hover-class="btn-hover"
        @click="onBack"
      >
        返回
      </button>
      <button
        class="btn h-40 !text-size-[12rpx]"
        hover-class="btn-hover"
        @click="onClear"
      >
        清空
      </button>
      <button
        class="primary-btn h-40 !text-size-[12rpx]"
        hover-class="primary-btn-hover"
        @click="onConfirm"
      >
        确认
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from "vue";

const emit = defineEmits(["confirm", "back"]);

// 显示签名画板
const show = ref(false);
const signatureShow = ref(false);

const signatureRef = ref();

// 确认
const onConfirm = () => {
  console.log("完成", signatureRef);
  signatureRef.value?.canvasToTempFilePath({
    success: (res) => {
      console.log("完成", res);
      if (res.isEmpty) return uni.$gs.showToast({ title: "请完成签名" });
      emit("confirm", res.tempFilePath);
      onBack();
    },
  });
};

// 清空
const onClear = () => {
  signatureRef.value?.clear();
};

// 返回
const onBack = () => {
  wx.setPageOrientation({ orientation: "portrait" });
  show.value = false;
  signatureShow.value = false;
};

defineExpose({
  open() {
    wx.setPageOrientation({
      orientation: "landscape",
      success: () => {
        show.value = true;
        setTimeout(() => {
          signatureShow.value = true;
        }, 500);
      },
    });
  },
  close: onBack,
});
</script>

<style lang="scss" scoped></style>

```

## FreeCellItem 列表可点击

```vue
<template>
  <view
    class="w-full relative"
    :hover-class="clickable && 'btn-hover'"
    @click="onClick"
  >
    <view class="center justify-between gap-5 py-2 px-4" :style="contentStyle">
      <view
        class="text-left"
        :style="{
          width: labelWidth,
        }"
      >
        <slot name="label">{{ label }}</slot>
      </view>
      <view class="flex-1 min-h-80 center justify-end">
        <slot>{{ value }}</slot>
        <uni-icons v-if="arrow" type="right" color="#2F3238" size="12" />
      </view>
    </view>
    <view
      v-if="splitLine"
      class="h-2 bg-line-1 m-auto"
      :style="splitLineStyle"
    ></view>
  </view>
</template>
<script setup>
const props = defineProps({
  // 分割线
  splitLine: {
    type: Boolean,
    default: true,
  },
  // label-width
  labelWidth: {
    type: String,
    default: "120rpx",
  },
  // label
  label: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  // cell样式
  contentStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  // 分割线样式
  splitLineStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false,
  },
  // 右侧箭头
  arrow: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["click"]);

const onClick = () => {
  if (!props.clickable) return;
  emit("click");
};
</script>
<style lang="scss" scoped></style>
```
