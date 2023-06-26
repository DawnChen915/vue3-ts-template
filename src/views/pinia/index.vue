<template>
    <!-- vue3页面 -->
    <div>{{ myTheme.themeColor }}</div>
    <el-color-picker
        :model-value="themeColor"
        style="vertical-align: middle"
        @change="colorChange"
    />
    <el-input v-model="colorType.name" v-my-directive="'lal'" style="width:300px ;" />
</template>

<script setup lang='ts'>
import theme from '@/store/theme';

const myTheme = theme()
const themeColor = computed(() => myTheme.themeColor)
function colorChange(color: string) {
    myTheme.setThemeColor(color)
}

watch(themeColor, (color) => {
    console.log(color)
})
onMounted(() => {
    console.log('onMounted')
})
const colorType = reactive({
    name: '亮蓝'
})

const vMyDirective = {
    mounted: (el: any) => {
        el.querySelector('input').focus()
        // 在元素上做些操作

    }
}
</script>

<style scoped>
</style>