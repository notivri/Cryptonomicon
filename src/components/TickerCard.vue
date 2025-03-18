<script setup>
import { defineProps, defineEmits } from 'vue'
import deleteIcon from '@/icons/deleteIcon.vue'

const props = defineProps({
  ticker: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['select', 'delete'])

function handleSelect() {
  emit('select', props.ticker)
}

function handleDelete() {
  emit('delete', props.ticker)
}
</script>

<template>
  <div @click="handleSelect" :class="['ticker-card', { selected: isSelected }]">
    <div class="card-header">
      <dt>{{ ticker.name }} - USD</dt>
      <dd>{{ ticker.price }}</dd>
    </div>
    <button @click.stop="handleDelete" class="delete-button">
      <delete-icon /> Удалить
    </button>
  </div>
</template>

<style scoped>
.ticker-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  margin: 0.5rem;
  padding-bottom: 0.5rem;
  width: 15rem;

  & .card-header {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
  }

  &.selected {
    outline: 4px solid purple;
  }
}


.delete-button {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  color: rgba(113, 128, 150, 1);
  background-color: whitesmoke;
  font-weight: 600;
  transition: background-color 0.2s;


  &:hover {
    background-color: rgb(228, 228, 228);
  }
}
</style>
