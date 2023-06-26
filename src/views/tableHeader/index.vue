<template>
    <!-- vue3页面 -->
    <div>
        <p class="font-sans">table header generate</p>
        <el-input :autosize="{ minRows: 4, maxRows: 30 }" type="textarea" v-model="text"></el-input>

        <el-button style="margin-top: 20px;" type="primary" @click="gen">生成表头</el-button>
    </div>
</template>

<script setup lang='ts'>
const text = ref('')

const gen = (): void => {
    console.log(text.value)
    let arr = text.value.split('\n')
    let res = arr.reduce((pre, cur) => {
        let label = cur.replace(/[^\u4e00-\u9fa5]/gi, "");
        let prop = cur.replace(/[^a-zA-Z]/g, '')
        pre += `<el-table-column prop="${prop}" label="${label}"></el-table-column>\n`
        return pre
    }, '')

    text.value = res
}



</script>

<style scoped>
</style>