# ref元素引用

## 单元素

```vue
<template>
    <div>
       <audio ref="audioRef" src="xxx.mp3" controls />
    </div>
</template>

<script setup>
// 音频元素的引用
const audioRef = ref<HTMLAudioElement>();
</script>

<style lang="scss" scoped>

</style>
```

## 多元素数组

```vue
<template>
    <div>
        <audio v-for="(item,index) in [...Array(10)]" :key="index" :ref="setAudioRef" :src="item.link" controls />
    </div>
</template>

<script setup>
// 音频元素的引用
const audioRef = ref<HTMLAudioElement[]>([]);
const setAudioRef = (el: HTMLAudioElement) => {
  if (!audioRef.value.includes(el)) {
    audioRef.value.push(el);
  }
};
</script>

<style lang="scss" scoped>

</style>

```