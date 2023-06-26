<template>
  <div>
    <a href="https://windicss.org/" target="_blank">
      <h1 class="text-3xl mb-4">windi CSS官网</h1>
    </a>
  </div>
  <h1 class="w-10 text-3xl font-bold underline">Hello world!</h1>
  <el-button @click="changeMode">切换模式</el-button>
  <div class="dark:bg-dark-50 bg-light-50 text-dark-50 dark:text-light-800">
    <div>test text</div>
    <div>test text</div>
    <div>test text</div>
    <div>test text</div>
    <div>test text</div>
  </div>
  <div class="content">
    <div class="child"></div>
  </div>
</template>

<script setup lang="ts">
console.log('windi');
const mode = ref('light')
const changeMode = () => {
  mode.value == 'light' ? (
    document.documentElement.classList.remove('light'),
    document.documentElement.classList.add('dark'),
    mode.value = 'dark'
  ) : (
    document.documentElement.classList.remove('dark'),
    document.documentElement.classList.add('light'),
    mode.value = 'light'
  )

}
</script>
<style lang="scss" scoped>
//混入不通屏幕尺寸适配


.content {
  width: 100px;
  height: 100px;

  .child {
    width: 100px;
    height: 100px;
    background: red;
  }
}
</style>

