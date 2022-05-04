<template>
  <el-col :span="formItemData.span||6" v-if="!formItemData.noShow">
    <el-form-item 
      :label="formItemData.label"
      :label-width="formItemData.labelWidth"
      :rules="formItemData.rules"
      :prop="formItemData.prop">
      <el-cascader 
        v-if="formItemData.eType === 'Cascader'"
        v-bind="formItemData.props"
        v-model="formData[formItemData.prop]"
        :options="optionList[formItemData.prop]"
        @change="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})" />
      <el-select 
        v-if="formItemData.eType === 'Select'"
        v-model="formData[formItemData.prop]"
        v-bind="formItemData.props"
        @change="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})">
        <el-option 
          v-for="(optionItem,optionIndex) in optionList[formItemData.prop]"
          :key="optionIndex"
          :label="optionItem.label"
          :value="optionItem.value" />
      </el-select>
      <el-checkbox-group 
        v-if="formItemData.eType === 'CheckBox'"
        v-bind="formItemData.props"
        v-model="formData[formItemData.prop]"
        @change="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})">
        <el-checkbox 
          v-for="(optionItem,optionIndex) in optionList[formItemData.prop]"
          :key="optionIndex"
          :label="optionItem.value">
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
      <el-radio-group 
        v-if="formItemData.eType === 'Radio'"
        v-bind="formItemData.props"
        v-model="formData[formItemData.prop]"
        @change="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})">
        <el-radio 
          v-for="(optionItem,optionIndex) in optionList[formItemData.prop]"
          :key="optionIndex"
          :label="optionItem.value">
          {{optionItem.label}}
        </el-radio>
      </el-radio-group>
      <el-switch 
        v-if="formItemData.eType === 'Switch'"
        v-model="formData[formItemData.prop]"
        v-bind="formItemData.props" 
        @change="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})" />
      <el-date-picker 
        v-if="formItemData.eType === 'datePicker'"
        v-bind="formItemData.props"
        v-model="formData[formItemData.prop]" />
      <el-input 
        v-if="formItemData.eType === 'Input'"
        v-model="formData[formItemData.prop]"
        v-bind="formItemData.props"
        @input="changeEvent({prop:formItemData.prop,val:formData[formItemData.prop]})" >
      </el-input>
      <span v-if="formItemData.eType === 'text'">{{formItemData.text}}</span>
      <!-- itemLable插槽 -->
      <template #label v-if="formItemData.labelSlot">
        <slot :name="formItemData.labelSlot" :data="formData" ></slot>
      </template>
      <!-- 自定义插槽 -->
      <slot v-if="formItemData.slot" :name="formItemData.slot" :data="formData" ></slot>
      <!-- 判断有没有子级，递归调用自身 -->
      <template v-if="formItemData.child">
        <com-form-item 
          v-for="(childItem,index) in formItemData.child"
          :key="index"
          :formItemData="childItem"
          :optionList="optionList"
          @changeEvent="changeEvent">
        </com-form-item>
      </template>
    </el-form-item>
  </el-col>
</template>

<script setup>
import { defineProps, defineEmits, inject, toRefs } from 'vue'

const props = defineProps({
  formItemData: {
    type: Object,
  },
  optionList: {
    type: Object,
  },
})

const {optionList, formItemData} = toRefs(props)
const formData = inject('formData')

const emit = defineEmits(['changeEvent'])
const changeEvent = (e) => {
  emit('changeEvent', e)
}
</script>

<script>
export default {
  name: 'comFormItem',
}
</script>