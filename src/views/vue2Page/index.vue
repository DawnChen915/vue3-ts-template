<!-- page:vue2页面代码生成 author:dawn  -->
<template>
  <div class="flex mb-4">
    <el-input v-model="qureyParams" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" style="width: 30%;"
      placeholder="请输入查询参数">
    </el-input>
    <el-input v-model="tableParams" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" style="margin-left:10px"
      placeholder="请输入表格参数">
    </el-input>
  </div>
  <div class="m-4 ml-0">
    <el-button type="primary" @click="gen">打印</el-button>
    <el-button type="primary" @click="download">下载</el-button>
  </div>
  <el-input v-model="outPut" type="textarea" :autosize="{ minRows: 4, maxRows: 30 }" placeholder="输出"></el-input>
</template>

<script setup lang='ts'>
const qureyParams = ref<string>('')
const tableParams = ref<string>('')
const outPut = ref<string>('')
interface paramsItem {
  label: string,
  prop: string,
}
const gen = () => {
  let paramsArr = qureyParams.value.split('\n')
  let paramsObjs: paramsItem[] = []
  paramsArr.forEach(e => {
    paramsObjs.push({
      prop: e.split('\t')[0],
      label: e.split('\t')[e.split('\t').length - 1]
    })
  })
  let queryItem = paramsObjs.map(e => `${e.prop}:''`).join(',\r\n')
  let paramsOutPut = ''
  let tableOutPut = ''
  tableParams.value.split('\n').forEach(e => {
    let arr = e.split('\t')
    let label = arr[arr.length - 1]
    let prop = arr[0]
    tableOutPut += `<el-table-column label="${label}" prop="${prop}"></el-table-column>\r\n`
  })
  paramsObjs.forEach(e => {
    paramsOutPut +=
      `<el-form-item label="${e.label}" prop="${e.prop}">
          <el-input v-model="queryParams.${e.prop}" placeholder="请输入${e.label}"></el-input>
       </el-form-item>
       `
  })
  outPut.value = `
<template>
  <div style="padding:20px;">
    <el-form :inline="true" :model="queryParams">
        ${paramsOutPut}
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- 展示表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      ${tableOutPut}
    </el-table>
    <!-- 分页 -->
    <pagination :currentPage="queryParams.pageNum" :limit="queryParams.pageSize" :total="total"
      @pagination="handlePage"></pagination>
  </div>
</template>
\x3Cscript>
import Pagination from '../../components/Pagination'
import request from '../../utils/request'
export default {
  components: { Pagination },
  data () {
    return {
      queryParams: {
       ${queryItem},
        pageNum: 1,
        pageSize: 10
      },
      pageLoading: false,
      tableData: [],
      total: 0,
    }
  },
  mounted () {
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.queryParams.pageNum = 1
      this.getData()
    },
    getData () {
      this.pageLoading = true
      request.post('/contractMainProxy/pageInfo', this.queryParams).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.pageLoading = false
      })
    },
    handlePage ({ page, limit }) {
      this.queryParams.pageNum = page
      this.queryParams.pageSize = limit
      this.getData()
    }
  }
}
\x3C/script>`

}
const download = () => {
  var blob = new Blob([outPut.value])//这里type指定下载文件的类型，这里用的时.docx类型
  let downloadElement = document.createElement('a')//创建<a>标签
  let href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = 'index.vue' // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象

}
</script>

<style scoped>
</style>
