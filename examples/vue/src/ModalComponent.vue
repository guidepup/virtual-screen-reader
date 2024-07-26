<template>
  <OverlayComponent :show="isOpen">
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" class="modal">
      <button @click="$emit('close')" id="modal-close-button">Close Modal</button>
      <h1 id="modal-title">Modal Title</h1>
      <slot></slot>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OverlayComponent from './OverlayComponent.vue'

export default defineComponent({
  name: 'ModalComponent',
  components: {
    OverlayComponent
  },
  watch: {
    open: {
      handler(isOpen: boolean): void {
        this.isOpen = isOpen

        if (isOpen) {
          setTimeout(() => {
            const closeButton = document.querySelector('#modal-close-button') as HTMLButtonElement

            closeButton.focus()
          }, 0)
        }
      }
    }
  },
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isOpen: false
    }
  }
})
</script>

<style>
.modal {
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
