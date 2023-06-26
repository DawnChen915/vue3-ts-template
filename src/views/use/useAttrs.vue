<template>
    <!-- vue3页面 -->
    <div class="bg-blue-200 dark:bg-black p-4">
        子组件区域 组件attrs:
        <div>{{ attrs }} </div>
    </div>
</template>

<script setup lang='ts'>
const attrs = useAttrs()

</script>

<style scoped>
</style>