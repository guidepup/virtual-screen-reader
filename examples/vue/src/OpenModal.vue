<template>
  <button @click="isOpen = true">Open Modal</button>
  <ModalComponent :open="isOpen" @close="isOpen = false">Example Modal Content</ModalComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalComponent from './ModalComponent.vue'

export default defineComponent({
  name: 'ModalExample',
  components: {
    ModalComponent
  },
  data() {
    return {
      isOpen: false
    }
  }
})
</script>
