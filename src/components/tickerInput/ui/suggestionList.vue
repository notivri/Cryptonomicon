<script setup>
const props = defineProps({
  suggestions: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['selectSuggestion'])
</script>

<template>
  <div class="suggestions" :class="{ show: suggestions.length }">
    <span v-for="item in props.suggestions" :key="item" @click="emits('selectSuggestion', item.symbol)"
      :title="item.name">
      <img :src="item.logo" class="logo">
      {{ item.symbol }}
    </span>
  </div>
</template>

<style scoped>
.suggestions {
  z-index: 1;
  display: flex;
  position: relative;
  justify-content: flex-start;
  background-color: white;
  gap: 0.5rem;
  border-radius: 0 0 0.375rem 0.375rem;
  margin-top: -2rem;
  width: 20;

  padding: 0.5rem;
  padding-top: 1rem;
  transition: 0.5s transform;

  & span {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    background-color: rgb(232, 243, 253);
    color: rgba(45, 55, 72, 1);
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: 0.2s background-color;

    & .logo {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
    }

    &:hover {
      background-color: rgb(215, 228, 240);
    }
  }

  &.show {
    transform: translate(0, 1rem);
    margin-bottom: 1rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
