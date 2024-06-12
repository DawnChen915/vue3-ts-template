
<template>
  <div>
    <header style="font-size: 28px;margin:20px 0;">数据参数配置表</header>
    <el-form ref="formRef" :model="queryForm" label-placement="left">
      <el-form-item>
        <el-button type="primary" @click="handleQuery" :loading="pageLoading">查询</el-button>

        <el-button type="primary" @click="handleAdd">新增</el-button>
        <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
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
              <span>数据参数连接配置</span>
              <div>
                <el-tag :type="connectStatus.status">{{ connectStatus.msg }}</el-tag>
                <el-button class="ml-5" text>测试连接</el-button>
              </div>
            </div>
          </template>
          <el-form-item label="接口类型" prop="interType">
            <el-radio-group v-model="form.interType">
              <el-radio :label="1">本地接口</el-radio>
              <el-radio :label="2">外部rest接口</el-radio>
              <el-radio :label="3">数据库配置接口</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-card>
        <el-form-item label="数据源英文(自己用)" prop="aliasEn">
          <el-input v-model="form.aliasEn" placeholder="请输入数据源英文"></el-input>
        </el-form-item>
        <el-form-item label="数据源别名(使用者看)" prop="aliasZh">
          <el-input v-model="form.aliasZh" placeholder="请输入数据源别名"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 3" label="动态数据源接口的查询SQL" prop="dbSql">
          <el-input type="textarea" :rows="5" v-model="form.dbSql" placeholder="请输入动态数据源接口的查询SQL"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 3" label="关联的数据源配置" prop="dsId">
          <el-select v-model="form.dsId" placeholder="请输入关联的数据源配置">
            <el-option v-for="item in sourceData" :label="item.dsDesc" :value="item.id as number"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标分类描述" prop="indexClassifyDesc">
          <el-input v-model="form.indexClassifyDesc" placeholder="请输入指标分类描述"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="接口header参数" prop="interHeader">
          <el-input v-model="form.interHeader" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="接口body参数" prop="interParam">
          <el-input v-model="form.interParam" placeholder="请输入接口body参数"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="参数接口地址" prop="paramUrl">
          <el-input v-model="form.paramUrl" placeholder="请输入参数接口地址"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="一级指标描述" prop="primaryIndexDesc">
          <el-input v-model="form.primaryIndexDesc" placeholder="请输入一级指标描述"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="二级指标描述" prop="secondaryIndexDesc">
          <el-input v-model="form.secondaryIndexDesc" placeholder="请输入二级指标描述"></el-input>
        </el-form-item>
        <el-form-item v-if="form.interType == 1" label="动态数据源" prop="sqlParam">
          <el-input v-model="form.sqlParam" placeholder="请输入动态数据源"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注说明"></el-input>
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
import type { PartialDataConnect, SourceConfig } from '@/api/modules/word'
import { read, utils } from 'xlsx'

const queryForm = ref({

})
const tableData = ref<PartialDataConnect[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pageLoading = ref(false)
const dialogFormVisible = ref(false)
const form = ref<PartialDataConnect>({
  aliasEn: 'firePower',//数据源英文(自己用)
  aliasZh: '火电装机量',//数据源别名(使用者看)
  dbSql: `SELECT
sum(info.GENERATOR_RATED_CAP)
FROM
 mm_generator_info info
 LEFT JOIN mm_generator_rights r ON info.UNIT_ID = r.UNIT_ID
 LEFT JOIN mm_members m ON m.members_id = r.members_id
 and info.GENERATOR_TYPE='030000'
 where m.MARKET_DATE <= SYSDATE( ) AND ( m.EXIT_MARKET_DATE >= SYSDATE( ) OR m.EXIT_MARKET_DATE IS NULL )
 and  info.MARKET_DATE <= SYSDATE( ) AND ( info.EXIT_MARKET_DATE >= SYSDATE( ) OR info.EXIT_MARKET_DATE IS NULL ) `, //动态数据源接口的查询SQL
  dsId: 2, //	关联的数据源配置id		false
  indexClassifyDesc: 'string', //指标分类描述		false
  interHeader: 'string', //接口头参数		false
  interParam: 'string', //	接口body参数		false
  interType: 3,//	接口类型，1:代表本地接口，2:代表外部rest接口，3:数据库配置接口		false
  paramUrl: 'string', //	参数接口地址		false
  primaryIndexDesc: 'string', //	一级指标描述		false
  remark: 'string', //	备注说明，简单描述该模板用来干啥		false
  secondaryIndexDesc: 'string', //	二级指标描述		false
  sqlParam: 'string', //	动态数据源接口的查询SQL参数		false
  status: false,//	模板状态，默认是0，0代表新建状态，1表示已发布状态，2表示已作废		false
  threeLevelIndexDesc: 'string', //	三级指标描述		false

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
}
const handleEdit = (row: PartialDataConnect) => {
  formMode.value = '编辑'
  dialogFormVisible.value = true
  form.value = row
}
const formSubmit = async () => {
  try {
    subLoading.value = true
    if (formMode.value === '新增') {
      //  await reportApi.insertDataSource(form.value)
    } else {
      // await reportApi.updateDataSource(form.value)
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
const sourceData = ref<SourceConfig[]>([])
const getSourceData = () => {
  sourceData.value = []
  const params = {
    current: 1,
    size: 100,
    data: {}
  }
  reportApi.pageDataSource(params).then(res => {
    sourceData.value = res.data.records
  })
}
const upload = ref()
onMounted(() => {
  getSourceData()
  upload.value.addEventListener('change', readExcel, false)
})

const paramsMap = [{

  value: 'register',
  label: '注册',
  children: [
    {
      value: '发电装机总量',
      label: '发电装机总量',
      children: [
        {
          value: 'consistency',
          label: 'Consistency',
        }]
    }, {
      value: '发电量',
      label: '发电量',
      children: [
        {
          value: 'consistency',
          label: 'Consistency',
        }]
    }, {
      value: '市场主体注册情况',
      label: '市场主体注册情况',
      children: [
        {
          value: 'consistency',
          label: 'Consistency',
        }]
    },
    {
      value: '市场主体注册情况',
      label: '市场主体注册情况',
      children: [
        {
          value: 'consistency',
          label: 'Consistency',
        }]
    }]

}]
const readExcel = (e: any) => {

  const files = e.target.files;
  // 如果没有文件名
  if (files.length <= 0) {
    return false;
  } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
    ElMessage.error('上传格式不正确，请上传xls或者xlsx格式');
    return false;
  }

  const fileReader = new FileReader();
  fileReader.onload = (ev: any) => {
    try {
      const data = ev.target.result;
      // 切换为新的调用方式
      const workbook = read(data, {
        type: 'binary'
      });
      // 取第一张表
      const wsname = workbook.SheetNames[0];
      // 切换为新的调用方式 生成json表格内容
      const ws = utils.sheet_to_json(workbook.Sheets[wsname]);
      console.log(ws);
      // 后续为自己对ws数据的处理
    } catch (e) {
      return false;
    }
  };
  fileReader.readAsBinaryString(files[0]);
}

</script>
