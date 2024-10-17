# vue3在css中使用js变量

https://juejin.cn/post/7319890768512024628

## 前言

在vue3中提供了v-bind的方式，在css中快速调用js变量

## 调用方式

```vue
<script setup lang="ts">
import { ref } from 'vue'

const headerAlign = ref('center')
const contentAlign = ref('left')

</script>
<template>
  <div class="header">这是头部</div>
  <div class="content">这是内容</div>
</template>
<style lang="scss" scoped>
.header {
  text-align: v-bind(headerAlign)
}
.content {
  text-align: v-bind(contentAlign)
}
</style>
```

## 遇到的问题

这种方式在使用过程中有个问题，`style` 上需要加上 `scoped`，在调用一些挂载在全局的组件的时候，如 `dialog` ，在修改 `dialog` 样式时，不能加 `scoped` ，会导致 `js` 变量样式不生效，原理应该类似在外层使用局部变量，解决办法在 `html` 把 **js变量** 注册为 **css变量**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  headerAlign: {
    type: String,
    default: 'center',
  },
  contentAlign: {
    type: String,
    default: 'left',
  },
})

const visible = ref(false)

</script>
<template>
  <ODialog v-model="visible" class="easy-dlg"
    :style="{ '--headerAlign': headerAlign, '--contentAlign': contentAlign }">
    <template #header>{{ header }}</template>
    {{ content }}
  </ODialog>
</template>
<style lang="scss">
.easy-dlg {
  .o-dlg-header {
    text-align: var(--headerAlign);
  }
  .o-dlg-body {
    text-align: var(--contentAlign);
  }
}
</style>
```

## 总结

更多还是用于css变量这块，不容易出错，也更好兼荣到 `uni-app`。