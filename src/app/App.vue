<template>
  <div class="main-page">
    <tickerInput @addTicker="handleAddTicker" :tickers />

    <hr />
    <tickerFilter :filter :currentPage :hasNextPage @update:filter="filter = $event"
      @update:currentPage="currentPage = $event" />
    <template v-if="filteredTickers().length > 0">
      <hr />
      <tickerCards @deleteTicker="handleDeleteTicker" @selectTicker="handleSelectTicker" :filteredTickers
        :selectedTicker />
      <hr />
    </template>

    <TickerGraph v-if="selectedTicker" @closeGraph="handleCloseGraph" :tickerName="selectedTicker.name" :graphData />
  </div>
</template>

<script setup>
import './styles/main.css';
import { onMounted } from 'vue';
import {
  tickers,
  selectedTicker,
  graphData,
  currentPage,
  hasNextPage,
  filter,
  filteredTickers,
  updateTickers,
  handleAddTicker,
  handleDeleteTicker,
  handleSelectTicker,
  handleCloseGraph,
} from '@/entities/ticker/model/ticker.js';

import tickerInput from '@/components/tickerInput/tickerInput.vue';
import tickerCards from '@/components/tickerCards/tickerCards.vue';
import TickerGraph from '@/components/tickerGraph/tickerGraph.vue';
import tickerFilter from '@/components/tickerFilter/tickerFilter.vue';

onMounted(() => {
  const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());

  if (windowData.filter) {
    filter.value = windowData.filter;
  }

  if (windowData.page) {
    currentPage.value = parseInt(windowData.page, 10);
  }

  const tickersData = localStorage.getItem('cryptonomicon-list');

  if (tickersData) {
    tickers.value = JSON.parse(tickersData);
    updateTickers();
  }
});
</script>

<style scoped>
.main-page {
  display: block;
  justify-content: center;
  background-color: whitesmoke;
  margin: auto;
  max-width: 75rem;
  padding: 1rem;
}

.filtered-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;


  & .buttons-container {
    display: flex;
    gap: 0.5rem;
  }

}

hr {
  margin: 1rem;
}
</style>
