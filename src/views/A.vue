<template>
  <myInput v-model:text="text" v-model:title="title" />
</template>

<script setup>
import { ref } from 'vue'
import myInput from './B'

const text = ref('')
const title = ref('1')
</script>