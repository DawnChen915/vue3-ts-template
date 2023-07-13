<script setup lang="ts"></script>

<template>
  <div>超时时间为 30秒 钟，可以打开F12查看</div>
  <el-button @click="fakeApi">发起 POST 请求</el-button>
</template>

<script setup lang="ts">
import axios from 'axios';
import loginApi from '@/api/modules/login';

const loginFunc = () => {
  loginApi.postVerification({ a: 1, b: 2 });
};
const fakeApi=()=>{
 axios.post('http://localhost:3000/users/addUser').then(res=>{
   console.log(res)
 })
}
</script>
