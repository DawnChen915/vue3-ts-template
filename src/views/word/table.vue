<template>
  <!-- vue3页面 -->
  <div>
    <div class="shadow">
      <el-table :data="tableData" border>
        <el-table-column v-for="item in tableHeader" :label="item.label" :prop="item.prop"
          :align="item.align"></el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px;" class="flex">
      <el-input type="textarea" v-model="tableDataStr" placeholder="数据填充"></el-input>
      <el-button @click="genTable" type="primary" style="height: auto;margin-left: 10px;">渲染表格</el-button>
    </div>
    <div class="config">
      <div>表格配置
        <el-button type="text" @click="addCol">增加列</el-button>
      </div>
      <el-table :data="tableHeader" size="small">
        <el-table-column label="label">
          <template #default="{ row }">
            <el-input v-model="row.label" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="prop">
          <template #default="{ row }">
            <el-input v-model="row.prop" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="align">
          <template #default="{ row }">
            <el-select v-model="row.align">
              <el-option label="居中" value="center"></el-option>
              <el-option label="居左" value="left"></el-option>
              <el-option label="居右" value="right"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex">
      <el-input v-model="title" placeholder=""></el-input>
      <el-button @click="addTable" style="margin-left: 10px;">添加进模板</el-button>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { table } from 'console'


const tableData = ref([])
const tableHeader = ref([{
  label: '姓名',
  prop: 'name',
  align: 'center'
}, {
  label: '年龄',
  prop: 'age',
  align: 'center'
}, {
  label: '地址',
  prop: 'address',
  align: 'center'
}
])
const addCol = () => {
  tableHeader.value.push({
    label: '',
    prop: '',
    align: 'center'
  })
}
const tableDataStr = ref("[{name:'曹建斌',age:18,address:'呼和浩特'},{name:'何浩',age:17,address:'成都'}]")
const genTable = () => {
  console.log(tableDataStr.value)
  tableData.value = eval(tableDataStr.value)
}
const title = ref("表格1-1")
const emits = defineEmits(['addImage'])
const addTable = () => {
  emits('addImage', { base64: transferTable(), title: title.value })
}
//将element-ui的table转换为原生table
const transferTable = () => {
  const htmlStr = `
     <table style="border:1px;font-size:14px">
      <tr>
       ${tableHeader.value.map(item => `<th style="border:1px solid;background-color:#eee;padding:5px 10px">${item.label}</th>`).join("")}
        </tr>
        ${tableData.value.map(item => `<tr>${tableHeader.value.map(col => `<td style="border:1px solid;padding:5px 10px">${item[col.prop]}</td>`).join("")}</tr>`).join("")}
      </table>
  `
  return htmlStr
}

</script>

<style scoped>
.config {
  padding: 20px;
  font-size: 12px;
}
</style>
