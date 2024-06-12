<template>
  <div>
    <h1>html2Image</h1>
    <div>
      <button @click="">html2Image</button>
    </div>
    <iframe src="https://www.baidu.com" frameborder="0" style="width: 100%;height: 500px;"></iframe>

  </div>
</template>

<script setup lang='ts'>

import { ref } from 'vue'
defineProps<{ msg: string }>()

const img = ref('')




</script>

<style scoped></style>
