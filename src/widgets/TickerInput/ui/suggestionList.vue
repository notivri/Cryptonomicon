<script setup>
defineProps({
  suggestions: Array,
});
const emit = defineEmits(['select']);
</script>

<template>
  <div class="suggestions" :class="{ show: suggestions.length > 0 }">
    <span v-for="item in suggestions" :key="item" @click="emit('select', item)">
      {{ item }}
    </span>
  </div>
</template>

<style scoped>
.suggestions {
  z-index: 1;
  display: flex;
  width: 100%;
  position: relative;
  justify-content: flex-start;
  background-color: white;
  gap: 0.5rem;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  margin-top: -2rem;
  padding: 0.5rem;
  padding-top: 1rem;
  transition: 0.5s transform;

  & span {
    background-color: rgb(232, 243, 253);
    color: rgba(45, 55, 72, 1);
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: 0.2s background-color;

    &:hover {
      background-color: rgb(215, 228, 240);
    }
  }

  &.show {
    transform: translate(0, 1rem);
  }
}
</style>
