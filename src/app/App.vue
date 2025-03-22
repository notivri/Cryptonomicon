<script setup>
import './styles/main.css'
import { onMounted, ref, watch } from 'vue';
import tickerInput from '@/components/tickerInput/tickerInput.vue';
import tickerCards from '@/components/tickerCards/tickerCards.vue';
import TickerGraph from '@/components/tickerGraph/tickerGraph.vue';
import tickerFilter from '@/components/tickerFilter/tickerFilter.vue';

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

const filter = ref('')
const tickers = ref([]);
const selectedTicker = ref(null);
const graphData = ref([]);
const currentPage = ref(1)
const hasNextPage = ref(false)

const filteredTickers = () => {
  const start = (currentPage.value - 1) * 6
  const end = currentPage.value * 6
  const filtered = tickers.value.filter((ticker) => ticker.name.startsWith(filter.value.toUpperCase()))

  hasNextPage.value = filtered.length > end

  return filtered.slice(start, end)
}

async function getTickerData(ticker) {
  try {
    const response = await fetch(`https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=${ticker.name}-USD&api_key=${apiKey}`);

    if (response.status == 404) {
      alert(`${ticker.name} не найден!`)
      handleDeleteTicker(ticker)
      return
    }

    const data = await response.json();
    const tickerValue = data.Data[`${ticker.name}-USD`].VALUE;

    ticker.price = tickerValue > 2 ? tickerValue.toFixed(2) : tickerValue.toPrecision(2);

    if (selectedTicker.value && selectedTicker.value.name == ticker.name) {
      graphData.value.push(tickerValue);
    }
  } catch (err) {
    console.error('API error: ', err);
  }
}

function updateTickers() {
  if (tickers.value.length > 0) {
    tickers.value.forEach(ticker => {
      getTickerData(ticker);
    });

    setTimeout(updateTickers, 7000);
  }
}

function handleAddTicker(tickerName) {
  const newTicker = {
    name: tickerName,
    price: '-'
  };

  tickers.value.push(newTicker);
  filter.value = ''
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value));

  if (tickers.value.length === 1) {
    updateTickers();
  }

  const index = tickers.value.findIndex(ticker => ticker.name === tickerName);
  const newPage = Math.floor(index / 6) + 1;

  if (newPage !== currentPage.value) {
    currentPage.value = newPage;
  }
}

function handleDeleteTicker(ticker) {
  tickers.value = tickers.value.filter((toDeleteTicker) => ticker !== toDeleteTicker);
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value))

  if (tickers.value.length == 0) {
    selectedTicker.value = null;
    graphData.value = [];
  }

  if (selectedTicker.value == ticker) {
    selectedTicker.value = false
  }

  if (!filteredTickers().length) {
    currentPage.value--
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
    <tickerInput @addTicker="handleAddTicker" :tickers="tickers" />

    <hr />
    <tickerFilter :filter="filter" :currentPage="currentPage" :hasNextPage="hasNextPage"
      @update:filter="filter = $event" @update:currentPage="currentPage = $event" />
    <template v-if="filteredTickers().length > 0">
      <hr />
      <tickerCards @deleteTicker="handleDeleteTicker" @selectTicker="handleSelectTicker" :filteredTickers
        :selectedTicker />
      <hr />
    </template>

    <TickerGraph v-if="selectedTicker" :tickerName="selectedTicker.name" :graphData @closeGraph="handleCloseGraph" />
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
