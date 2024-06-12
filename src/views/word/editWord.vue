<template>
  <!-- //左右布局 -->
  <div class="flex shadow">
    <div class="config">
      <div class="title" style="font-size:16px;margin-left: 20px;padding: 10px;">封面内容</div>
      <div class="flex">
        <div class="flex-1">
          <el-input v-model="module.pageTitle" placeholder="请输入标题" @click="inputClick2('')"></el-input>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="flex-1">
          <el-input type="textarea" v-model="module.pageDate" placeholder="请输入副标题"></el-input>
        </div>
      </div>
      <div style="margin-top: 20px;font-size:16px;margin-left: 20px;padding: 10px;">模板内容</div>
      <div style="text-align: right;margin-bottom: 20px;"><el-button size="small" type="primary"
          @click="add">+</el-button></div>
      <el-tree :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-input :model-value="node.label" placeholder="请输入" @input="handleChange($event, node)"
              @click="inputClick(node, data)">
              <template #prepend>
                <el-button :icon="NodeIcon(data)" />
              </template>
            </el-input>
            <div style="margin-left: 20px;">
              <a v-if="node.level < 4" @click="append(node, data)"> + </a>
              <el-popover v-if="node.level == 4" placement="right" trigger="click">
                <template #reference>
                  <el-button style="margin-right: 16px" type="primary" size="small">添加</el-button>
                </template>
                <ul style="text-align: center;">
                  <li>
                    <el-button link :icon="Document" @click="append(node, data)">文本</el-button>
                  </li>
                  <li>
                    <el-button link :icon="Picture" @click="addCom('images', images, node)">图片</el-button>
                  </li>
                  <li>
                    <el-button link :icon="iconTable" @click="addCom('tables', tables, node)">
                      表格</el-button>
                  </li>
                  <li>
                    <el-button link :icon="TrendCharts" @click="addCom('charts', charts, node)">
                      图表
                    </el-button>
                  </li>
                </ul>
              </el-popover>
              <a style="margin-left: 8px" @click="remove(node, data)"> - </a>
            </div>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="prod">
      <div ref="print" class="print">
        <div class="layout" contenteditable>
          <div>
            <span class="attachment">附件</span>
          </div>
          <div class="text-heading">
            <div>
              {{ module.pageTitle }}
            </div>
            <div>（模板）</div>
            <div class="text-heading-end">
              <div v-html="showSubTitle"></div>
              <div v-for=" paragraphTitle  in  dataSource " style="margin-top: 100px;">
                <div class="paragraphTitle" :style="(paragraphTitle.style as any)">
                  {{ paragraphTitle.label }}
                </div>
                <div v-for=" headline  in  paragraphTitle.children ">
                  <div class="headline" :style="(headline.style as any)">
                    {{ headline.label }}
                  </div>
                  <div v-for=" subheading  in  headline.children ">
                    <div class="subheading" :style="(subheading.style as any)">
                      {{ subheading.label }}
                    </div>
                    <div v-for=" minimumHeading  in  subheading.children ">
                      <div class="minimumHeading" :style="(minimumHeading.style as any)">{{ minimumHeading.label }}
                      </div>
                      <div v-for=" textContent  in  minimumHeading.children ">
                        <div v-if="textContent.type == 'textContent'" class="textContent"
                          :style="(textContent.style as any)">{{ textContent.label }}</div>
                        <div v-if="textContent.type == 'images'">
                          <img :src="textContent.url" alt="" :style="(textContent.style as any)">
                          <div style="font-size: 16px;margin-top: 10px;font-family: 黑体;">{{ textContent.label }}</div>
                        </div>
                        <div v-if="textContent.type == 'tables'">
                          <div v-html="textContent.url" :style="(textContent.style as any)"></div>
                          <div style="font-size: 16px;margin-top: 10px;font-family: 黑体;">{{ textContent.label }}</div>
                        </div>
                        <div v-if="textContent.type == 'charts'">
                          <img :src="textContent.url" alt="" :style="(textContent.style as any)">
                          <div style="font-size: 16px;margin-top: 10px;font-family: 黑体;">{{ textContent.label }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="control">
      <el-button type="primary" @click="reload">重新渲染</el-button>
      <el-button type="success" @click="saveVisible = true">保存</el-button>
      <el-button class="output" @click="exportWord">导出文档</el-button>
      <div style="padding: 20px;">
        <div style="font-size: 20px;"> 模板组件: {{ pick.content }}</div>
        <el-form :model="pick" v-if="pick.content">
          <el-form-item label="字体大小">
            <el-input v-model="pick.style.fontSize"></el-input>
          </el-form-item>
          <el-form-item label="字体粗细">
            <el-input v-model="pick.style.fontWeight"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="pick.style.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体对齐">
            <!-- <el-input v-model="pick.style.textAlign"></el-input> -->
            <el-select v-model="pick.style.textAlign" placeholder="">
              <el-option label="left" value="left"></el-option>
              <el-option label="center" value="center"></el-option>
              <el-option label="right" value="right"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体缩进">
            <el-input v-model="pick.style.textIndent"></el-input>
          </el-form-item>
          <el-form-item label="字体间距">
            <el-input v-model="pick.style.letterSpacing"></el-input>
          </el-form-item>
          <el-form-item label="字体行高">
            <el-input v-model="pick.style.lineHeight"></el-input>
          </el-form-item>
          <el-form-item label="字体样式">
            <!-- <el-input v-model="pick.style.fontFamily"></el-input> -->
            <el-select v-model="pick.style.fontFamily" placeholder="">
              <el-option label="宋体" value="宋体"></el-option>
              <el-option label="黑体" value="黑体"></el-option>
              <el-option label="楷体" value="楷体"></el-option>
              <el-option label="仿宋" value="仿宋"></el-option>
              <el-option label="微软雅黑" value="微软雅黑"></el-option>
              <el-option label="Arial" value="Arial"></el-option>
              <el-option label="Tahoma" value="Tahoma"></el-option>
              <el-option label="Verdana" value="Verdana"></el-option>
              <el-option label="Times New Roman" value="Times New Roman"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体换行">
            <el-input v-model="pick.style.whiteSpace"></el-input>
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-input v-model="pick.style.margin"></el-input>
          </el-form-item>
          <el-form-item label="宽">
            <el-input v-model="pick.style.width"></el-input>
          </el-form-item>
          <el-form-item label="高">
            <el-input v-model="pick.style.height"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="添加" v-model="component.visible" width="600px" @close="component.visible = false">
      <component :is="component.component" @addImage="handleAddImage"></component>
    </el-dialog>
    <el-dialog title="保存" v-model="saveVisible" width="400px" @close="saveVisible = false">
      <el-form ref="saveFormRef" :model="module" label-width="100px" style="margin-right: 50px;">
        <el-form-item label="模板名称" required prop="moduleName"
          :rules="[{ required: true, message: '请输入模板名称', trigger: 'blur' }]">
          <el-input v-model="module.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="模板编号" prop="modulesCode">
          <el-input v-model="module.moduleCode" placeholder="00001"></el-input>
        </el-form-item>
        <el-form-item label="模板版本号" prop="moduleVersion">
          <el-input v-model="module.moduleVersion" placeholder="1.0.0"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="module.remark" placeholder="备注说明，简单描述该模板用来干啥"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveVisible = false">取 消</el-button>
        <el-button type="primary" @click="save(saveFormRef)">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import FileSaver from "file-saver";
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Picture, TrendCharts, Document } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import charts from './charts.vue';
import tables from './table.vue';
import images from './image.vue';
import router from '@/router';
import iconTable from '@/components/icons/iconTable.vue';
import iconH1 from '@/components/icons/iconH1.vue'
import iconH2 from '@/components/icons/iconH2.vue'
import iconH3 from '@/components/icons/iconH3.vue'
import iconH4 from '@/components/icons/iconH4.vue'
import reportApi from '@/api/modules/word'
import type { Module } from '@/api/modules/word';
const { params } = useRoute()
const moduleId = Number(params.id)
const module = ref<Module>({
  id: 0,
  moduleName: '',
  moduleCode: '',
  moduleVersion: '',
  moduleType: 0,
  pageContent: '',
  pageTitle: '',
  pageDate: '',
  status: 0,
  remark: ''
})
const findList = () => {
  reportApi.pageData({ current: 1, size: 100 }).then(res => {
    module.value = res.data.records.find((item: Module) => item.id == moduleId)
  })
}
const findContent = () => {
  reportApi.findModuleStyle(moduleId).then(res => {
    const node = JSON.parse(res.data[res.data.length - 1].nodeInfo)
    dataSource.value = node
    console.log(dataSource.value)
  })
}
findList()
findContent()

// const title = ref<string>('默认标题')
// const subTitle = ref<string>(`XX电力交易中心
// 二〇二X年X月
// `)
//展示副标题
const showSubTitle = computed(() => {
  return module.value.pageDate.replace(/\n/g, '<br/>')
})
interface Style extends Record<string, unknown> {
  fontSize?: string
  fontWeight?: string
  color?: string
  textAlign?: string
  textIndent?: string
  letterSpacing?: string
  lineHeight?: string
  fontFamily?: string
  whiteSpace?: string
  width?: string
  height?: string
  marginBottom?: string
  wordBreak?: string
  margin?: string
  borderCollapse?: string
}
const content = ref<{
  type: string
  content: string
  style: Style
}[]>([
  {
    type: 'paragraphTitle',
    content: '一级标题',
    style: {
      fontSize: '26px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px'
    }
  },
  {
    type: 'headline',
    content: '二级标题',
    style: {
      fontSize: '23px',
      fontWeight: '500',
      textAlign: 'left',
      textIndent: '2em',
      marginBottom: '20px',

    }
  },
  {
    type: 'subheading',
    content: '三级标题',
    style: {
      fontSize: '21px',
      fontWeight: '350',
      textAlign: 'left',
      textIndent: '2em',
      marginBottom: '20px',
    }
  },
  {
    type: 'minimumHeading',
    content: '四级标题',
    style: {
      fontSize: '19px',
      fontWeight: 'bolder',
      textAlign: 'left',
      marginBottom: '20px',
      textIndent: '2em',
      fontFamily: 'fangsong'
    }
  },
  {
    type: 'textContent',
    content: '文本内容',
    style: {
      fontSize: '19px',
      fontWeight: '200',
      textAlign: 'left',
      marginBottom: '20px',
      fontFamily: 'fangsong',
      whiteSpace: 'normal',
      wordBreak: 'break-all',
      textIndent: '2em',
      letterSpacing: '5px',
      lineHeight: '30px'
    }
  },
  {
    type: 'images',
    content: '图片',
    style: {
      width: '50%',
      height: 'auto',
      textAlign: 'center',
      margin: 'auto'
    }
  },
  {
    type: 'tables',
    content: '表格',
    style: {
      width: 'fit-content',
      height: 'auto',
      textAlign: 'center',
      margin: 'auto',
      borderCollapse: 'collapse',
    }
  },
  {
    type: 'charts',
    content: '图表',
    style: {
      width: '50%',
      height: 'auto',
      textAlign: 'center',
      margin: 'auto'
    }
  }
])
const pick = ref<{
  type: string
  content: string
  style: Style
}>({
  type: 'textContent',
  content: '文本内容',
  style: {
    fontSize: '19px',
    fontWeight: '200',
    textAlign: 'left',
    marginBottom: '20px',
    fontFamily: 'fangsong',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
    textIndent: '2em',
    letterSpacing: '5px',
    lineHeight: '30px'
  }
})
interface Tree {
  id: number       //id
  type?: string   //类型
  label: string   //标题
  url?: string  //图片路径
  children?: Tree[],
  style?: Style
}
const dataSource = ref<Tree[]>([])
const NodeIcon = (data: Tree) => {
  switch (data.type) {
    case 'paragraphTitle':
      return iconH1
    case 'headline':
      return iconH2
    case 'subheading':
      return iconH3
    case 'minimumHeading':
      return iconH4
    case 'textContent':
      return Document
    case 'images':
      return Picture
    case 'tables':
      return iconTable
    case 'charts':
      return TrendCharts
    default:
      return Document
  }
}
let id = 1000
//新增节点
const append = (node: Node, data: Tree) => {
  let type = ''
  switch (node.level) {
    case 1:
      type = 'headline'
      break;
    case 2:
      type = 'subheading'
      break;
    case 3:
      type = 'minimumHeading'
      break;
    case 4:
      type = 'textContent'
      break;
    default:
      break;
  }
  const style = content.value.find((item) => item.type === type)?.style
  const newChild = { id: id++, type: type, label: '', children: [], style: style }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}
//新增根节点节点
const add = () => {
  const style = content.value.find((item) => item.type === 'paragraphTitle')?.style
  const newChild = { id: id++, type: 'paragraphTitle', label: '', style: style, children: [] }
  dataSource.value.push(newChild)
  dataSource.value = [...dataSource.value]
}
// 删除节点
const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}
// 重新渲染
const reload = () => {
  console.log(dataSource.value)
  dataSource.value = [...dataSource.value]
}
// 修改节点
const handleChange = (value: string, node: Node) => {
  node.data.label = value
}
// 点击节点
const inputClick = (node: Node, data: Tree) => {
  const componentName = content.value.find((item) => item.type === data.type)?.content as string
  pick.value = {
    type: data.type as string,
    content: componentName,
    style: data.style as Style
  }
}

// 导出word
const exportWord = () => {
  const html = getModelHtml(getHtml(document.querySelector('.print') as Element), getStyle());
  console.log(html)
  const fileName = module.value.pageTitle + ".doc"
  FileSaver.saveAs(
    new Blob([html], { type: "application/msword;charset=utf-8" }),
    fileName
  );
}
// 获取模板html
const getModelHtml = (mhtml: string, style: string) => {
  return `
				Content-Type: text/html; charset="utf-8"
					<!DOCTYPE html>
					<html>
					<head>
            <meta charset="utf-8"></meta>
					<style>
          .layout {width: 800px;height: auto;}
          .attachment {color: black;font-weight: bolder;font-size: 25px;}
          .text-heading {font-size: 35px;margin: 150px 0px 400px;text-align: center;}
          .text-heading-end {margin-top: 550px;font-size: 22px;}
					${style}
					</style>

					</head>
						${mhtml}
					</html>
				`
}
// 获取html
const getHtml = (dom: Element) => {
  // innerHTML: 从对象的起始位置到终止位置的全部内容, 不包括HTML标签。
  // outerHTML: 除了包含innerHTML的全部内容外, 还包含对象标签本身。
  let _dom = dom || document;
  let result = _dom.outerHTML;
  return "<body printmarginleft='72' printmarginright='72' printmargintop='56' printmarginbottom='56'>" + result + "</body>";
}
// 获取style
const getStyle = () => {
  var str = `<head><meta charset="utf-8"></meta>;
              <style>
              .layout {width: 800px;height: auto;}
              .attachment {color: black;font-weight: bolder;font-size: 25px;}
              .text-heading {font-size: 35px;margin: 150px 0px 400px;text-align: center;}
              .text-heading-end {margin-top: 550px;font-size: 22px;}
              .paragraphTitle {font-size: 26px;font-weight: bold;text-align: center;margin-bottom: 20px;}
              .headline {font-size: 22px;font-weight: 500;text-align: center;margin-bottom: 20px;}
              .subheading {font-size: 20px;font-weight: 350;text-align: left;margin-bottom: 20px;}
              .minimumHeading {font-size: 18px;font-weight: bolder;text-align: left;margin-bottom: 20px;font-family: fangsong;}
              .textContent {width: 100%;font-size: 16px;font-weight: 200;text-align: left;margin-bottom: 20px;font-family: fangsong;white-space: normal;word-break: break-all;text-indent: 2em;letter-spacing: 5px;line-height: 30px;}
              </style>
             </head>`
  return '';
}
const inputClick2 = (type?: string) => {
  //pick.value = content.value.find((item) => item.type === type)
}


const dynamicStyle = (content: Tree) => {
  return content.style as any
}
const component = ref<
  {
    visible: boolean
    type: string
    data: Tree
    component: any
  }>({
    visible: false,
    type: '',
    data: {
      id: 0,
      label: '',
      type: '',
      children: []
    },
    component: '',
  })
const addCom = (type: string, components: any, node: Node) => {
  component.value.type = type
  component.value.component = markRaw(components)
  component.value.data = node.data as Tree
  component.value.visible = true
}
//将图片加入word文档
const handleAddImage: (obj: { base64: string, title: string }) => void = ({ base64, title }) => {
  const { type } = component.value
  const style = content.value.find((item) => item.type === type)?.style
  const newChild = { id: id++, type: component.value.type, label: title, url: base64, style: style }
  component.value.visible = false
  const parent = component.value.data
  if (!parent.children) {
    parent.children = []
    parent.children.push(newChild)
  } else {
    parent.children.push(newChild)
  }
}
//

// 保存
const saveFormRef = ref<FormInstance>()
const saveVisible = ref(false)

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const res = await formEl.validate((valid: any) => {
    if (!valid) {
      return false
    } else {
      return false
    }
  })
  if (!res) return
  const html = getModelHtml(getHtml(document.querySelector('.print') as Element), getStyle())
  const data = {
    id: moduleId,
    moduleName: module.value.moduleName,
    moduleCode: module.value.moduleCode,
    moduleVersion: module.value.moduleVersion,
    moduleType: 1,
    pageContent: html,
    pageTitle: module.value.pageTitle,
    pageDate: module.value.pageDate,
    status: 0,
    remark: module.value.remark
  }
  const moduleRes = await reportApi.updateModule(data)

  // formatTree(dataSource.value)
  reportApi.updateModuleStyle({ moduleId: moduleId, nodeInfo: JSON.stringify(dataSource.value), nodeList: dataSource.value })


  console.log(dataSource.value)
  router.push({
    name: 'word',
    // params: {
    //   html: html,
    //   title: title.value,
    //   subTitle: subTitle.value,
    //   dataSource: JSON.stringify(dataSource.value),
    //   content: JSON.stringify(content.value),
    //   moduleName: saveParams.value.moduleName,
    //   moduleCode: saveParams.value.moduleCode,
    //   moduleVersion: saveParams.value.moduleVersion,
    // }
  })
}
//遍历树节点 为每个节点添加style
const formatTree = (nodeList: Tree[]) => {
  nodeList.forEach((item) => {
    item.style = content.value.find(e => e.type == item.type)?.style
    if (item.children) {
      formatTree(item.children)
    }
  })
}
</script>

<style scoped>
a {
  all: revert
}

.config {
  position: sticky;
  top: 0;
  padding: 20px;
  background-color: #fff;
  width: min(400px, 50vw);
  height: calc(100vh - 40px);
  overflow-y: auto;

}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

:deep().el-tree-node__content {
  height: 40px;
}

/* // 以下为word的样式 */
.layout {
  width: 800px;
  height: auto;
  border: 1px solid black;
}

.attachment {
  color: black;
  font-weight: bolder;
  font-size: 25px;
}

.text-heading {
  font-size: 35px;
  margin: 150px 0px 400px;
  text-align: center;
}

.text-heading-end {
  margin-top: 550px;
  font-size: 22px;
}

.paragraphTitle {
  width: 80%;
  margin-left: 10%;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.headline {
  width: 80%;
  font-size: 23px;
  font-weight: 500;
  text-align: left;
  text-indent: 2em;
  margin-bottom: 20px;
  margin-left: 10%;
}

.subheading {
  width: 80%;
  font-size: 21px;
  font-weight: 350;
  text-align: left;
  text-indent: 2em;
  margin-bottom: 20px;
  margin-left: 10%;
}

.minimumHeading {
  width: 80%;
  font-size: 19px;
  font-weight: bolder;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 10%;
  text-indent: 2em;
  font-family: fangsong;
}

.textContent {
  width: 80%;
  font-size: 19px;
  font-weight: 200;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 10%;
  font-family: fangsong;
  white-space: normal;
  word-break: break-all;
  text-indent: 2em;
  letter-spacing: 5px;
  line-height: 30px;
}

.control {
  position: sticky;
  top: 0;
  padding: 20px;
  height: 100px;
}

.high-tree-node {
  height: 60px;
}

.tables {
  border-collapse: collapse;
  width: 80%;
  margin-left: 10%;
  text-align: center;
  margin: auto;
}
</style>
