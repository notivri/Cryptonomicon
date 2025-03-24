<script setup>
import DeleteIcon from '@/shared/icons/deleteIcon.vue';

const props = defineProps({
  ticker: {
    type: Object,
    required: true
  },
  selectedTicker: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['delete', 'select'])
</script>

<template>
  <div @click="emit('select', ticker)" :class="['ticker-card', { selected: props.selectedTicker }]">
    <div class="card-header">
      <dt>{{ props.ticker.name }} - USD</dt>
      <dd>{{ props.ticker.value }}</dd>
    </div>
    <button @click.stop="emit('delete', props.ticker)" class="delete-button">
      <DeleteIcon /> Удалить
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
  width: 20rem;
  cursor: pointer;
}

.card-header {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1rem;
}

.card-header dt {
  color: rgba(0, 0, 0, 0.418);
  font-size: 1rem;
  font-weight: 700;
}

.card-header dd {
  font-size: 2rem;
  font-weight: 500;
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
}

.delete-button:hover {
  background-color: rgb(228, 228, 228);
}

.selected {
  outline: 0.3rem solid rgba(85, 60, 154, 1);
}
</style>
