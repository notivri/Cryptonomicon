<template>
  <div class="ticker-grid">
    <TickerCard v-for="ticker in props.filteredTickers()" :key="ticker.name" :ticker
      :selectedTicker="props.selectedTicker === ticker" @select="emits('selectTicker', $event)"
      @delete="emits('deleteTicker', $event)" />
  </div>
</template>

<script setup>
import TickerCard from './ui/tickerCard.vue';

const props = defineProps({
  filteredTickers: {
    type: Function,
    required: true
  },
  selectedTicker: {
    type: [Object, Boolean],
    required: false,
    default: null
  }
})

const emits = defineEmits(['deleteTicker', 'selectTicker'])
</script>

<style>
.ticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
  place-items: center;
}
</style>
