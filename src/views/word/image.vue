<template>
  <el-upload ref="upload" action="aa" class="upload-demo" :on-exceed="handleExceed" :limit="1" :on-change="handleChange"
    style="margin: 0px 20px;" :auto-upload="false" :show-file-list="false">
    <template #trigger>
      <el-button type="primary" size="small">选择图片</el-button>
    </template>
  </el-upload>
  <div style="padding: 20px;">
    <cropper :url="clipImgCfg.url" @clip-img="clipImg" />
  </div>

  <div class="flex justify-center" style="margin: 0 20px;">
    <el-input v-model="title" placeholder="图片标题"></el-input>
    <el-button type="primary" @click="addInWord" style="margin-left: 20px;">添加进模板</el-button>
  </div>
</template>

<script setup lang="ts">
import cropper from '@/components/cropper.vue'
import chart from '@/assets/chart.png'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadUserFile, UploadRawFile } from 'element-plus'
const clipImgCfg = reactive({
  url: chart,
  rt: 1 / 1
})

// const updateImgCfg = () => {
//   clipImgCfg.url = '/public/99999.jpg'
//   clipImgCfg.rt = 16 / 9
// }

// 裁剪后的图片事件
const img = ref<ArrayBuffer>()
const clipImg = (imgData: ArrayBuffer) => img.value = imgData
const handleChange: UploadProps['onChange'] = (uploadFile) => {
  // const file = uploadFile as UploadUserFile
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw as Blob)
  reader.onload = () => {
    clipImgCfg.url = reader.result as string
  }
}
const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
const emits = defineEmits(['addImage'])
const title = ref('')
const addInWord = () => {
  if (img.value) {
    emits('addImage', { base64: img.value, title: title })
  }
}
</script>
