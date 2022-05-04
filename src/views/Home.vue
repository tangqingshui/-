<template>
  <div class="home">
   
    <com-form ref="form">
      <template #aa="{item}">
        {{item}}
        <el-input v-model="item.title" placeholder="aa"></el-input>
      </template>
    </com-form>
    <com-form ref="form">
      <template #aa>
        <el-input v-model="aa" placeholder="aa"></el-input>
      </template>
    </com-form>
  </div>
</template>

<script setup>
import { reactive, ref, defineExpose, onMounted } from 'vue'
import comForm from './About.vue'
const form = ref()
const aa = ref('')
onMounted(() => {
  console.log(form.value.a);
})
</script>
