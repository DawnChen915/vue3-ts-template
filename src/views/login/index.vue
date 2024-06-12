<template>
  <div>超时时间为 30秒 钟，可以打开F12查看</div>
  <el-button @click="fakeApi">发起 POST 请求</el-button>
  <el-autocomplete v-model="state1" :fetch-suggestions="querySearch" @select="handleSelect" :select-when-unmatched="true"
    clearable class="inline-input w-50" placeholder="Please Input" />
  <my-auto-complete v-model="state" />
</template>

<script setup lang="ts">
import axios from 'axios';
import loginApi from '@/api/modules/login';
import myAutoComplete from '@/components/myAutoComplete.vue';
import MyAutoComplete from '@/components/myAutoComplete.vue';

const loginFunc = () => {
  loginApi.postVerification({ a: 1, b: 2 });
};
const fakeApi = () => {
  axios.post('http://localhost:3000/users/addUser').then(res => {
    console.log(res)
  })
}
const state = ref('');

const state1 = ref('');
watch(state1, (val) => {
  if (val.charAt(val.length - 1) === '@') {
    return
  }
  state.value = val
})
const querySearch = (queryString, cb) => {
  const query = '@' + queryString.split('@')[queryString.split('@').length - 1]
  const restaurants = [
    { value: '@1', address: '上海市普陀区金沙江路 1518 弄' },
    { value: '@2', address: '上海市普陀区金沙江路 1517 弄' },
    { value: '@3', address: '上海市普陀区金沙江路 1519 弄' },
    { value: '@4', address: '上海市普陀区金沙江路 1516 弄' },
  ];
  const results = queryString
    ? restaurants.filter((restaurant) => restaurant.value.includes(query))
    : restaurants;
  // 调用 callback 返回建议列表的数据
  cb(results);
};
const handleSelect = (item) => {
  state1.value = state.value + '{' + item.value + '}'
}
</script>
