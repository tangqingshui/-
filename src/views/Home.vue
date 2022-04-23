<template>
  <div class="home">
    <com-form :controls="controls">
      <template #aa>
        22
      </template>
    </com-form>
    <com-form :form-default-data="formDefaultData"
              @comInput="comInput"
              :controls="controls"></com-form>
    <div @click="changDefaultData">cc</div>
  </div>
</template>

<script setup>
import { reactive, ref } from '@vue/reactivity'
import comForm from './About.vue'

const controls = reactive([
  { prop: 'a', label: '试验1', required: true, props: { readonly: true } },
  { prop: 'b', label: '试验2', required: false },
  { prop: 'c', label: '试验2', required: false },
  { prop: 'd', label: '试验2', required: false },
  { prop: 'e', label: '试验2', required: false },
  { prop: 'f', label: '试验2', required: false },
])
const formDefaultData = reactive({ required: true })
const changDefaultData = () => {
  controls[0].label = 'aaa'
  console.log(controls)
}
const comInput = (e) => {
  console.log(e)
}
</script>
