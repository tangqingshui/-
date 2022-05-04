<template>
  <div>
    <el-input v-model="text" v-bind="$attrs" ref="eInput" />
     <el-input v-model="title"/>
  </div>
</template>

<script setup>
import {ref, computed, defineExpose, defineProps,defineEmits, toRefs} from 'vue'
const props = defineProps({
  text: {
    type:String
  },
  title: {
    type:String
  }
})
const { text:text1,title:title1 } = toRefs(props)
const emit = defineEmits(['update:text','update:title'])
const text = computed({
  get: () => text1.value,
  set: val => {
    emit('update:text',val)
  }
})
const title = computed({
  get: () => title1.value,
  set: val => {
    emit('update:title',val)
  }
})
</script>