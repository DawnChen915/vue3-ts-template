<template>
  <div><img ref="image" class="img" :src="props.url"></div>
</template>

<script setup lang="ts">
// 引入cropperjs库与相关css
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

// 传来的图片地址
const props = defineProps({
  url: '',
  // 比例

})
const image = ref(null)//img元素
const emit = defineEmits(['clip-img'])


// 监听props
watch(props, val => {
  // 设置cropper
  cropper.setAspectRatio(val.aspectRatio)
  cropper.replace(val.url)
})

/**
* 获取裁剪的base64图片发给父级
* @param {canvas} cvs canvas数据
*/
const clipImgEmitBase64Img = (cvs: any) => {
  // 将canvas转为图片数据 → 参数1:图片格式[image/webp, image/jpeg, image/png] | 参数2：图片裁剪后的清晰度，相当于压缩图片 0 - 1(只对jpeg与webp有效)
  const base64 = cvs.toDataURL('image/webp', .75)

  // 裁剪后发送数据给父级
  emit('clip-img', base64)
}

let cropper: Cropper = null
onMounted(() => {
  cropper = new Cropper(image.value, {
    // aspectRatio: props.aspectRatio,//裁剪比例 → [1 / 1, 19 / 9 ,...........]
    viewMode: 1,//裁剪模式 [0,1,2,3]
    dragMode: 'crop',
    //     crop：创建新的裁剪框，将裁剪的区域外删除
    // move：移动画布，裁剪的同时，可拖动图片
    // none：什么也不做，不可拖动图片
    // 重点：加载完成将第一次裁剪的图片数据发给父级
    ready() {
      clipImgEmitBase64Img(this.cropper.getCroppedCanvas())
    },
    cropend() {
      clipImgEmitBase64Img(this.cropper.getCroppedCanvas())
    }
  })
})
</script>

<style scoped>
.img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  max-width: 100%;
}
</style>
