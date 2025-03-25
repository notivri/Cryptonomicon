<template>
  <div class="filtered-container">
    <BaseInput type="text" :value="props.filter" @input="emit('update:filter', $event.target.value)"
      placeholder='Найти тикер' />
    <div class="buttons-container">
      <BaseButton @click="emit('update:currentPage', props.currentPage - 1)" :disabled="props.currentPage <= 1">
        Назад
      </BaseButton>
      <BaseButton @click="emit('update:currentPage', props.currentPage + 1)" :disabled="!hasNextPage">
        Вперед
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '@/shared/ui/baseInput.vue';
import BaseButton from '@/shared/ui/baseButton.vue';

const props = defineProps({
  filter: String,
  currentPage: Number,
  hasNextPage: Boolean
});

const emit = defineEmits(['update:filter', 'update:currentPage']);
</script>

<style scoped>
.filtered-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
}

.buttons-container {
  display: flex;
  gap: 0.5rem;
}
</style>
