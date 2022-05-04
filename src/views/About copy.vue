<template>
  <div>
    <comForm>
    </comForm>
    <buildElCard></buildElCard>
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
  useSlots,
  renderSlot,
  defineExpose,
} from 'vue'

const comForm = () => {
  let result = null
  result = h(
    resolveComponent('el-form'),
    { model: formData, ref: form, labelWidth: labelWidth },
    // 预留插槽位
    () => [slotBuild({ 'v-slot': 'aa' })()]
  )
  return result
}

const a = ref(1432)
const slots = useSlots()
// 匿名插槽使用情况
// const defaultSlot = reactive(slots.default && slots.default().length)
// console.log(slots.default())
defineExpose({ a })
const baseInput = (obj) => {
  let result = null
  result = h(resolveComponent('el-input'), {
    modelValue: formData[obj.prop],
    onInput: (val) => comInput(val, obj.prop),
    ...obj.props,
  })
  return result
}
const comInput = (val, prop) => {
  formData[prop] = val
  emit('comInput', { prop, val })
}
const buildElCol = (obj, VNode) => {
  const property = {}
  if (obj.isInCol) {
    obj.style || (obj.style = {})
    if (typeof obj.style === 'string') {
      obj.style += ';padding-left:10px'
    } else {
      obj.style.paddingLeft = '10px'
    }
  }
  if (obj && obj.splitColumn !== false) {
    // result = h('el-col', localSplitOption, [result])
    if (vModelOption.model && vModelOption.model.fullCol) {
      localSplitOption.props.span = 24
    }
    if (vModelOption.model && vModelOption.model.cusSpan) {
      localSplitOption.props.span = vModelOption.model.cusSpan
    }
    VNode = h('el-col', localSplitOption, [VNode])
  }
  return VNode
}
const buildElCard = (data) => {
  let result = null
  // 使用插槽
  result = h(
    resolveComponent('el-card'),
    {},
    {
      header: () => h('div', { className: 'box-card-title' }, data.title),
      default: () => h('div', 333),
    }
  )

  return result
}
// 控制列
const getFormClass = (columnCount) => {
  let propCount = formItemCount
  if (typeof columnCount === 'number' && columnCount > 0) {
    return { props: { span: Math.ceil(24 / columnCount) } }
  } else {
    if (propCount === 1) {
      return { props: { span: 24 } }
    } else if (propCount < 9) {
      return { props: { span: 12 } }
    } else if (propCount < 19) {
      return { props: { span: 8 } }
    } else {
      return { props: { span: 6 } }
    }
  }
}
// 构建子项
const loadChild = (controls, callOption = {}) => {
  let result = []

  for (let i = 0; i < controls.length; i++) {
    let control = controls[i]
    if (
      isUpdate &&
      control.updateOption &&
      control.updateOption.visible === false
    ) {
      continue
    }
    // visible==true 则不渲染
    if (
      bindVisibles.hasOwnProperty(control.key) &&
      !bindVisibles[control.key]
    ) {
      continue
    }
    let children = []
    if (control.children && control.children.length > 0) {
      // 多列表单
      let baseAppendOptions
      if (control.module === 'el-card' && control.splitColumn !== undefined) {
        baseAppendOptions = getFormClass(control.splitColumn)
      } else {
        let splitColumn = control.splitColumn || control.children.length
        baseAppendOptions = { props: { span: Math.ceil(24 / splitColumn) } }
        if (
          control.splitColumn === false ||
          (control.splitColumn !== true &&
            callOption.appendOptions &&
            callOption.appendOptions.splitColumn === false)
        ) {
          baseAppendOptions.splitColumn = false
        }
      }
      children = loadChild(control.children, {
        parent: control,
        appendOptions: baseAppendOptions,
      })
    }
    let ins = null
    let propVNode = null

    switch (control.module) {
      case 'el-card':
        if (control.splitColumn !== undefined) {
          children.push(h('div', { attrs: { style: 'clear:both' } }))
        }
        ins = cardBuild(control, children)
        break
      case 'el-upload':
        let insList = uploadBuild(that, h, control, children)
        result.push(
          buildElCol(h, control, callOption.appendOptions, insList[0])
        )
        result.push(buildElCol(h, {}, { props: { span: 24 } }, insList[1]))
        break
      case 'el-select':
        if (isHiddenElUploadBind()) {
        } else {
          propVNode = selectBuild(that, h, control, children)
          ins = baseFormItemBuild(
            that,
            h,
            control,
            [propVNode],
            callOption.appendOptions
          )
        }
        break
      case 'el-cascader':
        if (isHiddenElUploadBind()) {
        } else {
          propVNode = cascaderBuild(that, h, control, children)
          ins = baseFormItemBuild(
            that,
            h,
            control,
            [propVNode],
            callOption.appendOptions
          )
        }
        break
      case 'slot':
        if (isHiddenElUploadBind()) {
        } else {
          propVNode = slotBuild(that, h, control, children)
          ins = baseFormItemBuild(
            that,
            h,
            control,
            [propVNode],
            callOption.appendOptions
          )
        }
        break
      default:
        if (isHiddenElUploadBind()) {
        } else {
          propVNode = defaultBuild(that, h, control, children)
          ins = baseFormItemBuild(
            that,
            h,
            control,
            [propVNode],
            callOption.appendOptions
          )
        }
    }
    if (ins !== null) {
      result.push(ins)
      // 存储 el-upload 所绑定的组件vm，用于获取下拉框的文本，展示到列表
      if (
        propVNode != null &&
        control.model &&
        control.model.prop &&
        that.uploadBindProps.hasOwnProperty(control.model.prop)
      ) {
        that.uploadBindProps[control.model.prop].module = control.module
        that.uploadBindProps[control.model.prop].$VNode = propVNode
      }
    }
  }
  if (
    callOption.parent &&
    callOption.parent.splitColumn !== false &&
    callOption.appendOptions &&
    callOption.appendOptions.splitColumn !== false
  ) {
    let elRowOption = {}
    if (callOption.parent.gutter) {
      elRowOption.props = { gutter: callOption.parent.gutter }
    }
    return [h('el-row', elRowOption, result)]
  }
  return result
}
const slotBuild = (vModelOption) => {
  if (vModelOption.hasOwnProperty('v-slot')) {
    return (item) => renderSlot(slots, vModelOption['v-slot'], { item })
  } else {
    console.error('自定义插槽没有对应的v-slot，请先在配置文件绑定。')
  }
}
const formData = reactive({})
const form = ref()
const labelWidth = '100px'
</script>