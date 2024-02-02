<template>
  <h1>Text Area Counter</h1>
  <textarea @input="handleInput" :maxCount="maxCount"></textarea>
  <span data-testid="remaining-count">{{ remainingCharacters }} characters left</span>
  <span class="visually-hidden" aria-live="polite">{{ remainingCharactersForAnnouncement }} characters left</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Announce character count at most every 1 second, EXCEPT
const DEBOUNCE_TIMEOUT = 1000
// When have fewer than 10 characters remaining, in which case announce every
// character.
const DEBOUNCE_CHAR_LIMIT = 10

export default defineComponent({
  name: 'TextAreaCounter',
  props: {
    maxCount: {
      type: Number,
      default: 50
    },
    modelValue: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    const remainingCharacters = this.maxCount - this.modelValue.length

    return {
      debounceTimerId: 0,
      remainingCharacters,
      remainingCharactersForAnnouncement: remainingCharacters
    }
  },
  methods: {
    handleInput(event: Event): void {
      const value = (event.target as HTMLTextAreaElement).value
      this.$emit('update:modelValue', value)

      const remainingCharacters = this.maxCount - value.length
      this.remainingCharacters = remainingCharacters
      this.handleRemainingCharactersAnnouncement(remainingCharacters)
    },
    handleRemainingCharactersAnnouncement(remainingCharacters: number) {
      if (remainingCharacters <= DEBOUNCE_CHAR_LIMIT) {
        clearTimeout(this.debounceTimerId)

        this.remainingCharactersForAnnouncement = remainingCharacters

        return
      }

      clearTimeout(this.debounceTimerId)

      this.debounceTimerId = setTimeout(() => {
        this.remainingCharactersForAnnouncement = remainingCharacters
      }, DEBOUNCE_TIMEOUT)
    }
  }
})
</script>

<style>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
