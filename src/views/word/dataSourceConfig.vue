
<template>
  <div>
    <header style="font-size: 28px;margin:20px 0;">数据源配置表</header>
    <el-form ref="formRef" :model="queryForm" label-placement="left">
      <el-form-item>
        <el-button type="primary" @click="handleQuery" :loading="pageLoading">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border v-loading="pageLoading">
      <el-table-column prop="dsDesc" label="数据源描述" align="left" />
      <el-table-column prop="dsType" label="数据源类型" align="left" />
      <el-table-column prop="dsDriver" label="数据源驱动" align="left" />
      <el-table-column prop="dsUrl" label="数据源连接地址" align="left" />
      <el-table-column prop="dsUser" label="用户名" align="left" />
      <el-table-column prop="dsAuth" label="用户密码" align="left">
        <!-- <template #default="scope">
          <span>{{ scope.row.dsAuth.replace(/./g, '*') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="status" label="模板状态" align="left" />
      <el-table-column prop="remark" label="备注说明" align="left" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin:20px 0;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog :title="formMode" v-model="dialogFormVisible" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" label-placement="left" label-width="130px">
        <el-card shadow="never" style="margin-bottom: 20px;">
          <template #header>
            <div class="flex justify-between">
              <span>数据库连接配置</span>
              <div>
                <el-tag :type="connectStatus.status">{{ connectStatus.msg }}</el-tag>
                <el-button class="ml-5" text>测试连接</el-button>
              </div>
            </div>
          </template>
          <el-form-item label="数据源驱动" prop="dsDriver" :rules="[
            { required: true, message: '请输入数据源驱动', trigger: 'blur' }
          ]">
            <el-input v-model="form.dsDriver" placeholder="请输入数据源驱动" />
          </el-form-item>
          <el-form-item label="数据源连接地址" prop="dsUrl" :rules="[
            { required: true, message: '请输入数据源连接地址', trigger: 'blur' }
          ]">
            <el-input v-model="form.dsUrl" placeholder="请输入数据源连接地址" />
          </el-form-item>
          <el-form-item label="用户名" prop="dsUser" :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]">
            <el-input v-model="form.dsUser" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="用户密码" prop="dsAuth" :rules="[
            { required: true, message: '请输入用户密码', trigger: 'blur' }
          ]
            ">
            <el-input type="password" v-model="form.dsAuth" placeholder="请输入用户密码" />
          </el-form-item>
        </el-card>
        <el-form-item label="数据源描述" prop="dsDesc">
          <el-input v-model="form.dsDesc" placeholder="请输入数据源描述" />
        </el-form-item>
        <el-form-item label="数据源类型" prop="dsType">
          <el-input v-model="form.dsType" placeholder="请输入数据源类型" />
        </el-form-item>
        <!-- <el-form-item label="模板状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入模板状态" />
        </el-form-item> -->
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="formSubmit" :loading="subLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang='ts'>
import reportApi from '@/api/modules/word'
import type { SourceConfig } from '@/api/modules/word'
const queryForm = ref({

})
const tableData = ref<SourceConfig[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pageLoading = ref(false)
const dialogFormVisible = ref(false)
const form = ref<SourceConfig>({
  dsDesc: '市场注册数据源连接',
  dsType: 'dbQuery',
  dsDriver: 'mysql',
  dsUrl: 'http://localhost:3306/',
  dsUser: 'root',
  dsAuth: '123123',
  status: false,//0代表新建状态，1表示已发布状态，2表示已作废
  remark: '市场注册数据源连接',
})
const formMode = ref('')
const handleQuery = () => {
  currentPage.value = 1
  getData()
}
const getData = () => {
  tableData.value = []
  const params = {
    current: currentPage.value,
    size: pageSize.value,
    data: {
      ...queryForm.value
    }
  }
  pageLoading.value = true
  reportApi.pageDataSource(params).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    pageLoading.value = false
  })
}
handleQuery()
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const connect = ref({
  dsDriver: '',
  dsUrl: '',
  dsUser: '',
  dsAuth: '',
})

const connectStatus = ref<{ status: '' | 'info' | 'success' | 'danger', msg: string }>({
  status: 'info',//'success'成功 'danger'失败 'info'未测试 ''测试中
  msg: '未测试',
})

const testConnect = () => {
  // reportApi.testConnect(connect.value).then(res=>{
  //   debugger
  // })
}
const subLoading = ref(false)
const handleAdd = () => {
  formMode.value = '新增数据源'
  dialogFormVisible.value = true
  // form.value = {
  //   dsDesc: '',
  //   dsType: '',
  //   dsDriver: '',
  //   dsUrl: '',
  //   dsUser: '',
  //   dsAuth: '',
  //   status: 0,//0代表新建状态，1表示已发布状态，2表示已作废
  //   remark: '',
  // }

}
const handleEdit = (row: any) => {
  formMode.value = '编辑'
  dialogFormVisible.value = true
  form.value = row
}
const formSubmit = async () => {
  try {
    subLoading.value = true
    if (formMode.value === '新增') {
      await reportApi.insertDataSource(form.value)
    } else {
      await reportApi.updateDataSource(form.value)
    }
    subLoading.value = false
    dialogFormVisible.value = false
    getData()
  } catch (e) {
    subLoading.value = false
  }

}
const handleRemove = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    reportApi.deleteDataSource(row.id).then(() => {
      getData()
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}
</script>
