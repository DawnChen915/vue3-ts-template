<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import enLocale from 'element-plus/lib/locale/lang/en'
const locale = zhCn;
const en = enLocale
</script>

<template class="">
  <div class="dark:bg-dark-50 dark:text-light-50">
    <GoBackHome></GoBackHome>
    <div class="m-5">
      <el-config-provider :locale="locale">
        <router-view></router-view>
      </el-config-provider>
    </div>
  </div>
</template>
