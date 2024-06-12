<template>
  <div>
    <el-table :data="list">
      <el-table-column label="语言">
        <template #default="{ row }">
          <el-select v-model="row.lang" placeholder="">
            <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.disabled"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="{ row }">
          <el-button type="primary" @click="onAdd">新增</el-button>
          <el-button type="danger" @click="onDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
defineProps<{ msg: string }>();

const list = ref([{ lang: '' }]);
const optionList = ref([
  { label: '中文', value: 'zh', disabled: false },
  { label: '英文', value: 'en', disabled: false },
  { label: '日文', value: 'ja', disabled: false },
]);
const onAdd = () => {
  list.value.push({
    lang: '',
  });
};
const onDel = (row: any) => {
  list.value.splice(list.value.indexOf(row), 1);
};
watch(
  list,
  (val) => {
    optionList.value.forEach((e: any) => {
      if (val.some((i) => e.value == i.lang)) {
        e.disabled = true;
      } else {
        e.disabled = false;
      }
    });
    console.log(optionList.value);
  },
  {
    deep: true,
  },
);
</script>

<style scoped></style>
