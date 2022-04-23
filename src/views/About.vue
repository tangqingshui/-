<template>
  <div>
    {{formDefaultData}}
    <comForm>
      123
    </comForm>
    {{formData}}
  </div>
</template>

<script setup>
import {
  h,
  ref,
  reactive,
  onMounted,
  resolveComponent,
  defineEmits,
  watch,
  defineProps,
  toRefs,
  useSlots
} from 'vue'
 
const props = defineProps({
  readonly: {
    type: Boolean,
    default: () => false,
  },
  isUpdate: {
    type: Boolean,
    default: () => false,
  },
  listOptions: {
    type: Object,
    default: () => {},
  },
  formDefaultData: {
    type: Object,
    default: () => {},
  },
  controls: {
    type: Object,
    default: () => [],
  },
  formRules: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['comInput'])
const {
  readonly,
  isUpdate,
  listOptions,
  formDefaultData,
  controls,
  formRules,
} = toRefs(props)
const form = ref()
const formData = reactive({
  a: 5,
  b: 2,
})
const comForm = () => {
  let result = null
  result = h(
    resolveComponent('el-form'),
    { ref: form, model: formData },
    () => {
    return controls.value.map((item) => {
      return baseFormItemBuild(item)
    })
  },
  )
  return result
}
const baseFormItemBuild = (obj) => {
  let result = null
  result = h(
    resolveComponent('el-form-item'),
    {
      style: { width: '400px' },
      prop: obj.prop,
      required: obj.required,
      label: obj.label,
      labelWidth: obj.labelWidth ? item.labelWidth : '100px',
    },
    () => [baseInput(obj)]
  )
  return result
}
const baseInput = (obj) => {
  let result = null
  result = h(resolveComponent('el-input'), {
    modelValue: formData[obj.prop],
    onInput: (val) => comInput(val, obj.prop),
    ...obj.props,
  })
  return result
}
const submit = () => {
  form.value.validate((e) => {
    console.log(e)
  })
}
const comInput = (val, prop) => {
  formData[prop] = val
  emit('comInput', { prop, val })
}
console.log(comForm)
</script>