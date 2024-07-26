<template>
  <span v-if="show">
    <teleport to="body">
      <span class="overlay">
        <slot />
      </span>
    </teleport>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OverlayComponent',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  }
})
</script>

<style>
.overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000030;
}
</style>
