<template>
  <div>
    <el-form 
      ref="form"
      :model="formData"
      v-bind="$attrs">
      <template
        v-for="(item,index) in formOptions"
        :key="index">
        <el-card 
          class="box-card"
          v-if="!item.noShow"
          :header="item.title"
          :body-style="bodyStyle"
          shadow="never">
          <el-row 
            :gutter="item.gutter"
            :justify="item.justify"
            :align="item.align">
            <com-form-item 
              v-for="(childItem,index) in item.child"
              :key="index"
              :formItemData="childItem"
              :optionList="optionList"
              @changeEvent="changeEvent">
              <template #[childItem.slot]="{data}" v-if="childItem.slot">
                <slot :name="childItem.slot" :data="data"></slot>
              </template>
            </com-form-item>
            <el-col :span="item.span||6" v-if="item.btn">
              <slot :name="item.btn">
              </slot>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import {defineProps, reactive, ref, provide, toRefs, watch } from 'vue'
import comFormItem from './com-form-item.vue'

const props = defineProps(
  {
    optionList:{
      type:Object,
      default() {
        return {}
      }
    },
    formDefaultData:{
      type:Object,
      default() {
        return {}
      }
    },
    formDataType:{
      type:Object,
      default() {
        return {}
      }
    },
    formOptions:{
      type:Array,
      default() {
        return []
      }
    }
  }
)
const {optionList,formDefaultData,formDataType,formOptions} = toRefs(props)

const formData = reactive({})
const writeFormData = (arr) => {
  arr.forEach(item => {
    if(item.prop){
      let controlValue = ''
      if(Object.prototype.hasOwnProperty.call(formDefaultData.value,item.prop)){
        controlValue = formDefaultData.value[item.prop]
      }
      
      switch (item.dataType) {
        case 'Number':
          formData[item.prop] = controlValue === 0 ? '' : controlValue
          break
        case 'Array':
          formData[item.prop] = controlValue || []
          break
        case 'Object':
          formData[item.prop] =  controlValue || {}
          break
        default:
          formData[item.prop] = controlValue
          break
      }
    }
    if(item.child){
      writeFormData(item.child)
    }
  })
}
writeFormData(formOptions.value)
watch(formDefaultData, () => {
  writeFormData(formOptions.value)
},{
  deep:true
})

provide('formData', formData)
const form = ref()
const reset = () => {
  form.value.resetFields()
}
const validate = (success = () => {}, error = () => {}) => {
  form.value.validate((valid) => {
    if (valid) {
      let resForm = JSON.parse(JSON.stringify(formData));
      // 处理数值类型，暂只处理一层
      for (let key in resForm) {
        let info = formDataType.value[key]
        switch (info) {
          case 'Number':
            resForm[key] = (!resForm[key] || isNaN(resForm[key])) ? 0 : +resForm[key]
            break
        }
      }
      success(resForm)
    } else {
      console.log(111);
      error()
    }
  })
}
// 设置表单属性值
const setFormValue = (obj) => {
    let arr = Object.entries(obj)
    for(const [key,value] of arr) {
      formData[key] = value
    }
}
// 获取表单属性值
const getFormValue = (key) => {
   return formData[key]
}
defineExpose({reset,validate,setFormValue,getFormValue})

// 监听input事件与change事件
const emit = defineEmits(['changeEvent'])
const changeEvent = (e) => {
  emit('changeEvent', e)
}

const bodyStyle = {
  border: 'none',
}
</script>

<style>
.el-card{
  border: none !important;
}
.el-card__header{
  border: none !important;
}

</style>