<template>
  <el-autocomplete :model-value="state" @input="handleInput" :fetch-suggestions="querySearch" @select="handleSelect"
    :select-when-unmatched="true" clearable class="inline-input w-50" placeholder="Please Input">
    <template #prepend>
      <slot name="prepend">
      </slot>
    </template>
  </el-autocomplete>
</template>
<script setup lang="ts">
const state = ref('');
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
onMounted(() => {
  console.log(props.modelValue)
  state.value = props.modelValue ? props.modelValue : ''
})
watch(state, (val) => {
  if (val.charAt(val.length - 1) === '@') {
    return
  }
  emits('update:modelValue', state.value)
})
const querySearch = (queryString: string, cb: Function) => {
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
const handleSelect = (item: any) => {
  // console.log(state.value, props.modelValue)
  const modelvalue = props.modelValue ? props.modelValue : ''
  state.value = modelvalue + '{' + item.value + '}'
  // emits('update:modelValue', state.value)

}
const handleInput = (val: string) => {
  state.value = val
}
</script>
