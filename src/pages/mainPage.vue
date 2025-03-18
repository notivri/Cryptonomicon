<script setup>
import { ref } from 'vue';
import TickerInput from '@/components/TickerInput.vue';
import TickerCard from '@/components/TickerCard.vue';
import ValueGraph from '@/components/ValueGraph.vue';

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

let id = 0;
const tickers = ref([]);
const selectedTicker = ref(null);
const graphData = ref([]);

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

      if (graphData.value.length > 20) {
        graphData.value.shift();
      }
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

    setTimeout(updateTickers, 5000);
  }
}

function handleAddTicker(tickerName) {
  if (tickers.value.find(ticker => ticker.name === tickerName)) {
    alert('Такой тикер уже есть');
    return;
  }

  const newTicker = {
    id: id++,
    name: tickerName,
    price: '-'
  };

  tickers.value.push(newTicker);

  if (tickers.value.length === 1) {
    updateTickers();
  }
}

function handleDeleteTicker(ticker) {
  tickers.value = tickers.value.filter((toDeleteTicker) => ticker !== toDeleteTicker);

  if (tickers.value.length === 0) {
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
</script>

<template>
  <div class="main-page">
    <ticker-input @addTicker="handleAddTicker" />

    <div v-if="tickers.length > 0">
      <hr style="margin: 1rem;" />
      <div class="ticker-grid">
        <ticker-card v-for="ticker in tickers" :key="ticker.name" :ticker="ticker"
          :isSelected="selectedTicker === ticker" @select="handleSelectTicker" @delete="handleDeleteTicker" />
      </div>
      <hr style="margin: 1rem;" />
    </div>

    <value-graph v-if="selectedTicker" :tickerName="selectedTicker.name" :graphData="graphData"
      @close="handleCloseGraph" />
  </div>
</template>

<style scoped>
.main-page {
  display: block;
  justify-content: center;
  background-color: whitesmoke;
  margin: auto;
  max-width: 50rem;
  padding: 1rem;
}

.ticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
  place-items: center
}
</style>
