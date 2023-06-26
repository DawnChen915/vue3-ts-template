<script setup>
import { ref, onMounted } from "vue"
import autoAnimate from "@formkit/auto-animate"

const dropdown = ref() // we need a DOM node
const show = ref(false)
const items = ref(["😏", "😐", "😑", "😒", "😕"])
const removeItem = (toRemove) => {
    items.value = items.value.filter((item) => item !== toRemove)
}
onMounted(() => {
    autoAnimate(dropdown.value) // thats it!
})
</script>

<template>
    <a href="https://auto-animate.formkit.com/" target="_blank">
        <h2 class="text-3xl mb-4">auto-animate官网地址</h2>
    </a>
    <div ref="dropdown" class="dropdown w-1/2 ">
        <strong class="dropdown-label" @click="show = !show">Click me to open!</strong>
        <p class="dropdown-content" v-if="show">
            宁静之海是一粒微尘悬浮在太阳光束中的数十万概念星系射电望远镜的第一领域。一道光从天文学家身上落下，两个身穿连体服、头戴头盔的幽灵般的白色身影轻轻舞动着，出现在猎户座的宝剑银河百科全书的意识中。另一个世界上移动绒毛虫洞网络的点点滴滴对虫洞网络的思考与美丽的故事几乎没有很好的证据和数十亿亿亿亿亿亿万。
        </p>
    </div>
    click me to remove
    <ul v-auto-animate class="flex">

        <li v-for="item in items" :key="item" @click="removeItem(item)" class="text-2xl ">
            {{ item }}
        </li>
    </ul>
</template>
<style scoped>
.dropdown {
    padding: 10px;
    border: 1px #333 solid;
    border-radius: 5px;
}
</style>