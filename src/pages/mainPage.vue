<script setup>
import { onMounted, ref, watch } from 'vue';
import tickerInput from '@/widgets/TickerInput/tickerInput.vue';
import tickerCard from '@/widgets/TickerCard/tickerCard.vue';
import valueGraph from '@/widgets/valueGraph/valueGraph.vue';

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

let id = 0;
const tickers = ref([]);
const selectedTicker = ref(null);
const graphData = ref([]);
const currectPage = ref(1)
const filter = ref('')
const hasNextPage = ref(false)

const filteredTickers = () => {
  const start = (currectPage.value - 1) * 6
  const end = currectPage.value * 6
  const filtered = tickers.value.filter((ticker) => ticker.name.startsWith(filter.value.toUpperCase()))

  hasNextPage.value = filtered.length > end

  return filtered.slice(start, end)
}

async function getTickerData(ticker) {
  try {
    const response = await fetch(`https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=${ticker.name}-USD&api_key=${apiKey}`);

    if (response.status == 404) {
      alert(`${ticker.name} не найден!`)
      tickers.value = tickers.value.filter((toDeleteTicker) => ticker != toDeleteTicker)
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
    id: id++,
    name: tickerName,
    price: '-'
  };

  tickers.value.push(newTicker);
  filter.value = ''
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value))

  if (tickers.value.length === 1) {
    updateTickers();
  }
}

function handleDeleteTicker(ticker) {
  tickers.value = tickers.value.filter((toDeleteTicker) => ticker !== toDeleteTicker);
  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers.value))

  if (tickers.value.length == 0) {
    selectedTicker.value = null;
    graphData.value = [];
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
  currectPage.value = 1

  window.history.pushState(null, document.title, `${window.location.pathname}?filter=${filter.value}&page=${currectPage.value}`)
})

watch(currectPage, () => {
  window.history.pushState(null, document.title, `${window.location.pathname}?filter=${filter.value}&page=${currectPage.value}`)
})

onMounted(() => {
  const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

  if (windowData.filter) {
    filter.value = windowData.filter
  }

  if (windowData.page) {
    currectPage.value = windowData.page
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
    <ticker-input @addTicker="handleAddTicker" :tickers="tickers" />

    <div class="filtered-container">
      <button @click="currectPage--" v-if="currectPage > 1">Назад</button>
      <button @click="currectPage++" v-if="hasNextPage">Вперед</button>
      <input type="text" v-model="filter" />
    </div>
    <div v-if="tickers.length > 0">
      <hr style="margin: 1rem;" />
      <div class="ticker-grid">
        <ticker-card v-for="ticker in filteredTickers()" :key="ticker.name" :ticker="ticker"
          :isSelected="selectedTicker === ticker" @select="handleSelectTicker" @delete="handleDeleteTicker" />
      </div>
      <hr style="margin: 1rem;" />
    </div>

    <value-graph v-if="selectedTicker" :tickerName="selectedTicker.name" :graphData @close="handleCloseGraph" />
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

.ticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
  place-items: center
}

.filtered-container {
  display: flex;
  max-width: 30rem;
  gap: 1rem;

  & input {
    all: unset;
    width: 100%;
    padding-left: 0.5rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }

  & button {
    all: unset;
    display: flex;
    align-items: center;
    color: white;
    background-color: rgba(74, 85, 104, 1);
    font-weight: 500;
    gap: 0.5rem;
    margin: 1rem 1rem 0 0;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background-color: #5d6b83;
    }
  }
}
</style>
