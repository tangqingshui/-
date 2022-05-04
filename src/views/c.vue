<template>
  <div>
    <comForm @changeEvent="changeEvent" :optionList="optionList" :formOptions="formOptions" :formDataType="formDataType" :formDefaultData="formDefaultData" ref="form">
      <template #searchBtn>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </template>
    </comForm>
     <el-button type="primary" @click="shiyan">提</el-button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import comForm from './com-form'
import userFormControls from './userFormControls'

const form = ref()
const data = [
  {
    gutter: 10,
    noShow: false,
    btn: 'searchBtn',
    child: [
      {
        label: 'jjj',
        span:4,
        child: [
          { span: 11, prop: 'aa', eType: 'Select' },
          { eType: 'text', span: 2, text: '-' },
          { span: 11, prop: 'name', eType: 'Input', slot: 'aaa' },
        ],
        slot: 'aaa',
      },
      { prop: 'a', label: 'ccc', eType: 'Input' },
      { prop: 'b', label: 'ccc', eType: 'Input', required: true },
      { prop: 'c', label: 'ccc', eType: 'Input', required: true,dataType:'Number' },
    ],
  },
]
const optionList = reactive({
  aa: [
    {
      label: 1,
      value: 1,
    },
    {
      label: 2,
      value: 2,
    },
  ],
})
const {formOptions,setFormNoShow,formDataType} = userFormControls(data)
const formDefaultData = reactive({
  name:13
})
const changeEvent = (e) => {
  console.log(e)
}

const search = () => {
  form.value.validate()
}
const reset = () => {
  form.value.reset()
}
let flag = false
const shiyan = () => {
  flag = !flag
  setFormNoShow(['a','c'],flag)
  formDefaultData.name=formDefaultData.name+1
}
</script>