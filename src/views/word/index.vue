
<template>
  <div>
    <h1>报表模板</h1>
    <el-form ref="formRef" :model="queryForm" label-placement="left" inline>

      <el-form-item label="模板名称" prop="moduleName">
        <el-input v-model:value="queryForm.moduleName" placeholder="请输入模板名称" style="width: 300px;" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleQuery" :loading="pageLoading">查询</el-button>
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button type="warning" @click="configDataSource">数据源配置</el-button>
        <el-button type="warning" @click="configDataParams">数据参数配置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border v-loading="pageLoading">
      <!-- <el-table-column prop="id" label="主键" align="center" /> -->
      <el-table-column prop="moduleName" label="模板名称" align="center" />
      <el-table-column prop="moduleCode" label="模板编号" align="center" />
      <el-table-column prop="moduleVersion" label="模板版本号" align="center" />
      <el-table-column prop="statu" label="模板状态" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link size="small" type="danger" @click="handleRemove(scope.row)">删除</el-button>
          <el-button link size="small" type="primary" @click="perview(scope.row)">预览</el-button>
          <el-button link size="small" type="success" @click="download(scope.row)">下载模板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      class="m-5" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog :title="formMode" :visible.sync="dialogFormVisible">
      <el-form ref="formRef" :model="form" label-placement="left" label-width="120px">
        <el-form-item label="主键" prop="id">
          <el-input v-model:value="form.id" placeholder="请输入主键" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模板名称" prop="moduleName">
          <el-input v-model:value="form.moduleName" placeholder="请输入模板名称" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模板编号" prop="moduleCode">
          <el-input v-model:value="form.moduleCode" placeholder="请输入模板编号" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模板版本号" prop="moduleVersion">
          <el-input v-model:value="form.moduleVersion" placeholder="请输入模板版本号" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模板状态" prop="statu">
          <el-input v-model:value="form.statu" placeholder="请输入模板状态" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model:value="form.remark" placeholder="请输入备注" style="width: 300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="formSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog v-model="perviewDialog" @close="perviewDialog = false" width="fit-content">
      <div v-html="html"></div>
    </el-dialog>

  </div>
</template>
<script setup lang='ts'>
import router from '@/router'
import reportApi from '@/api/modules/word'
import FileSaver from "file-saver";
const queryForm = reactive({

  moduleName: '',


})
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogFormVisible = ref(false)
const form = ref({
  id: '',
  moduleName: '',
  moduleCode: '',
  moduleVersion: '',
  statu: '',
  remark: '',
})
const formMode = ref('')
onMounted(() => {
  handleQuery()
})
const handleQuery = () => {
  currentPage.value = 1
  getData()
}
const pageLoading = ref<boolean>(false)
const getData = () => {
  const params = {
    // moduleName: queryForm.moduleName,
    current: currentPage.value,
    size: pageSize.value,
  }
  pageLoading.value = true
  reportApi.pageData(params).then((res: any) => {
    tableData.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    pageLoading.value = false
  })
  // tableData.value = []
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}
const handleAdd = () => {
  router.push('/word/newWord')
  // formMode.value = '新增'
  // dialogFormVisible.value = true
  // form.value = {
  //   id: '',
  //   moduleName: '',
  //   moduleCode: '',
  //   moduleVersion: '',
  //   statu: '',
  //   remark: '',
  // }
}
//编辑
const handleEdit = (row: any) => {
  router.push('/word/editWord/' + row.id)
}
const formSubmit = () => {
  if (formMode.value === '新增') {
    ElMessage({
      type: 'success',
      message: '新增成功!'
    });
  } else {
    ElMessage({
      type: 'success',
      message: '编辑成功!'
    });
  }
  dialogFormVisible.value = false
}
//删除模板
const handleRemove = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    reportApi.deleteModule(row.id).then((res: any) => {
      getData()
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}
const route = useRoute()
//展示数据
// if (route.params) {
//   const data = {
//     id: route.params.id,
//     moduleName: route.params.moduleName,
//     moduleCode: route.params.moduleCode,
//     moduleVersion: route.params.moduleVersion,
//     html: route.params.html,
//     statu: route.params.statu,
//     remark: route.params.remark,
//   }
//   tableData.value.push(data)
// }
//预览
const perviewDialog = ref(false)
const html = ref('')
const perview = (row: any) => {
  perviewDialog.value = true
  html.value = row.pageContent
}
//下载
const download = (row: any) => {

  FileSaver.saveAs(
    new Blob([row.pageContent], { type: "application/msword;charset=utf-8" }),
    row.moduleName + '.doc'
  );
}

//数据源配置
const configDataSource = () => {
  router.push('/word/sourceConfig')
}
const configDataParams = () => {
  router.push('/word/paramsConfig')
}
</script>
<style scoped>
h1 {
  all: revert
}
</style>
