# 【vue3】样式穿透、完整新特性、动态css、css-module

https://vincef0ng.cn/post/vue-scoped-deep-css/#Vue3-%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E5%8F%98%E5%8C%96

https://blog.csdn.net/weixin_44171757/article/details/134095117

## 样式穿透

`vue2` 里面使用 `/deep/`

`vue3` 里面使用 `:deep()`

```css
:deep(.el-input__inner){
	background-color: 'red';
}

```

## 完整新特性

### :slotted()

```vue
//parent.vue
<template>
    <div>
        <p>这是父级</p>
        <span>==================================</span>
        <A>
        	<p class="red">这是父级传的插槽内容</p>
        </A>
    </div>
</template>
import A from '../components/A.vue';


//A.vue
<template>
    <div>这是A组件</div>
    <slot></slot>
</template>

<style scoped lang='scss'>
	:slotted(.red){
	    color: red;
	}
</style>
```

### :global()

全局样式，跟不加scoped效果一样


```vue
<style scoped lang='scss'>
	:global(div){
	    color: pink;
	}
</style>

// 和<style></style >一样的效果
```

## 动态css

```vue
<template>
    <div>
        <h1 class="box">
            动态css
        </h1>
    </div>
</template>


<script setup lang='ts'>
	import { ref } from 'vue'
	const style = ref({
	    color: 'green'
	})
	setTimeout(() => {
	    style.value.color = 'yellow'
	}, 2000);
</script >

<style scoped lang='scss'>
	.box {
	    color: v-bind('style.color');
	}
</style>
```

## css-module


单个：`:class="$style.box"`

多个：`:class="[$style.box,$style.border]"`

```vue

<h1 :class="[$style.box,$style.border]">
    css-module
</h1>

<style module>
	.box {
	    color: blue;
	}
	.border{
   	 	border: 1px solid red;
	}
</style>
```

```vue

<h1 :class="[yyx.box,yyx.border]">
    css-module
</h1>

<style module='yyx'>
	.box {
	    color: blue;
	}
	.border{
   	 	border: 1px solid red;
	}
</style>
```