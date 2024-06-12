<template>
  <!-- vue3页面 -->
  <div>
    <div class="chart"></div>
    <div class="config">
      <el-form :model="chartsConfig">
        <el-form-item label="图表标题">
          <el-input v-model="chartsConfig.title"></el-input>
        </el-form-item>
        <el-form-item label="图表横坐标">
          <el-input v-model="chartsConfig.xAxisData"></el-input>
        </el-form-item>
        <div class="grid-cols-2 grid gap-1">
          <el-card v-for="item in chartsConfig.series">
            <el-form-item label="图表类型">
              <el-select v-model="item.type">
                <el-option label="折线图" value="line"></el-option>
                <el-option label="柱状图" value="bar"></el-option>
                <el-option label="饼图" value="pie"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图表名称">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="图表纵坐标">
              <el-input v-model="item.data"></el-input>
            </el-form-item>
            <el-button type="danger" size="small" @click="remove(item)">删除</el-button>
          </el-card>
          <el-card @click="addSeries" shadow="hover">
            <div style="height: 100%;text-align: center;">
              <div>+添加图表</div>
              <img src="../../assets/chart.png" style="height: 100px;width: 100px;margin:auto" alt="">
            </div>
          </el-card>
        </div>
      </el-form>
    </div>
    <div style="padding: 20px 0;">
      <el-button @click="reload">渲染图表</el-button>
      <el-button @click="toImage" type="primary">添加进模板</el-button>
    </div>

  </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
const chartsConfig = ref({
  title: '折线图',
  xAxisData: "['风电','光伏','水电','火电','核电','生物电']",
  series: [
    {
      name: '发电量',
      type: 'line',
      data: '[5,20,36,10,10,20]'
    }
  ]
})
const option = ref({
  title: {
    text: '折线图'
  },
  tooltip: {},
  xAxis: {
    data: ['风电', '光伏', '水电', '火电', '核电', '生物电']
  },
  yAxis: {},
  series: [
    {
      name: '发电量',
      type: 'line',
      data: [
        5,
        20,
        36,
        10,
        10,
        20
      ]
    }
  ]
})
onMounted(() => {
  const mychart = echarts.init(document.querySelector('.chart') as HTMLElement)
  mychart.setOption(option.value)
})

//根绝配置渲染图表
const reload = () => {
  //先清除图表实例
  echarts.dispose(document.querySelector('.chart') as HTMLElement)
  const mychart = echarts.init(document.querySelector('.chart') as HTMLElement)
  const config = JSON.parse(JSON.stringify(chartsConfig.value))
  config.series = config.series.map((item: any) => {
    item.data = eval(item.data)
    return item
  })
  const option = {
    title: {
      text: config.title
    },
    tooltip: {},
    legend: {
      data: config.series.map((item: any) => item.name)
    },
    xAxis: {
      data: eval(config.xAxisData)
    },
    yAxis: {},
    series: config.series
  }
  mychart.setOption(option)
}
const emit = defineEmits(['addImage'])
//将图表转为图片
const toImage = () => {
  const mychart = echarts.getInstanceByDom(document.querySelector('.chart') as HTMLElement) as any
  const base64 = mychart.getDataURL()
  console.log(base64)
  emit('addImage', { base64, title: chartsConfig.value.title })
}
const addSeries = () => {
  chartsConfig.value.series.push({
    name: '',
    type: '',
    data: ''
  })
}
const remove = (item: any) => {
  const index = chartsConfig.value.series.findIndex((i: any) => i === item)
  chartsConfig.value.series.splice(index, 1)
}
</script>

<style scoped>
.chart {
  width: 500px;
  height: 300px;
}
</style>
