<script setup>
import './styles/main.css'

import { onMounted, ref, watch } from 'vue';
import { getTickerData } from '@/shared/api/api.js'

import tickerInput from '@/components/tickerInput/tickerInput.vue';
import tickerCards from '@/components/tickerCards/tickerCards.vue';
import TickerGraph from '@/components/tickerGraph/tickerGraph.vue';
import tickerFilter from '@/components/tickerFilter/tickerFilter.vue';

const filter = ref('')
const tickers = ref([]);
const selectedTicker = ref(null);
const graphData = ref([]);
const currentPage = ref(1)
const hasNextPage = ref(false)

const requestInterval = 7000
const maxVisibleCards = 6
const minNumberThreshold = 2
const bigNumberRounding = 2
const smallNumberRounding = 2

const filteredTickers = () => {
  const start = (currentPage.value - 1) * maxVisibleCards
  const end = currentPage.value * maxVisibleCards
  const filtered = tickers.value.filter((ticker) => ticker.name.startsWith(filter.value.toUpperCase()))

  hasNextPage.value = filtered.length > end

  return filtered.slice(start, end)
}

const updateTickers = () => {
  tickers.value.forEach(async (ticker) => {
    try {
      const response = await getTickerData(ticker.name);

      const newValue = response[`${ticker.name}-USD`].VALUE
      const normalizedValue = newValue > minNumberThreshold ? newValue.toFixed(bigNumberRounding) : newValue.toPrecision(smallNumberRounding)

      ticker.value = normalizedValue

      if (selectedTicker.value == ticker) {
        graphData.value.push(ticker.value)
      }
    } catch (error) {
      if (error.response.status == 404) {
        handleDeleteTicker(ticker)
      }
    }
  });
}

function handleAddTicker(tickerName) {
  const newTicker = {
    name: tickerName,
    value: '-'
  };

  tickers.value.push(newTicker);
  filter.value = ''
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value));
}

function handleDeleteTicker(ticker) {
  tickers.value = tickers.value.filter((toDeleteTicker) => ticker !== toDeleteTicker);
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value))

  if (selectedTicker.value == ticker) {
    selectedTicker.value = false
  }
}

function handleSelectTicker(ticker) {
  selectedTicker.value = ticker;
  graphData.value = [];
}

function handleCloseGraph() {
  selectedTicker.value = null;
  graphData.value = [];
}

watch(tickers, () => {
  if (tickers.value.length >= 1) {
    setInterval(updateTickers, requestInterval)
  }

  if (tickers.value.length == 0) {
    selectedTicker.value = null;
    graphData.value = [];
  }
})

watch(filteredTickers(), () => {
  if (!filteredTickers().length) {
    currentPage.value--
  }
})

watch(filter, () => {
  currentPage.value = 1

  window.history.pushState(null, document.title, `${window.location.pathname}?filter=${filter.value}&page=${currentPage.value}`)
})

watch(currentPage, () => {
  window.history.pushState(null, document.title, `${window.location.pathname}?filter=${filter.value}&page=${currentPage.value}`)
})

onMounted(() => {
  const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

  if (windowData.filter) {
    filter.value = windowData.filter
  }

  if (windowData.page) {
    currentPage.value = parseInt(windowData.page, 0)
  }

  const tickersData = localStorage.getItem("cryptonomicon-list")

  if (tickersData) {
    tickers.value = JSON.parse(tickersData)
    updateTickers()
  }
})
</script>

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
