<template>
    <!-- vue3页面 -->
    <div class="p-4">
        useRouter
        <el-button @click="jump">跳转</el-button>
    </div>
    <div>
        <use-attrs-vue name="12" style="padding:20px" class="useAttrs"></use-attrs-vue>
    </div>
</template>

<script setup lang='ts'>
import useAttrsVue from './useAttrs.vue';
const router = useRouter()
const jump = () => {
    router.push('/auto-animate')
}



</script>

<style scoped>
</style>