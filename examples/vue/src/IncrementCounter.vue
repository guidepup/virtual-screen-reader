<script lang="ts">
export default {
  data: () => ({
    count: 0,
  }),

  methods: {
    increment() {
      this.count++
    },
  },
}
</script>

<template>
  <h1>Increment Counter</h1>
  <p aria-live="polite">Times clicked: {{ count }}</p>
  <button @click="increment">increment</button>
</template>
