<script setup>
import { ref, } from 'vue';
import TickerInput from '@/components/TickerInput.vue';
import TickerCard from '@/components/TickerCard.vue';
import ValueGraph from '@/components/ValueGraph.vue';

let id = 0;
const tickers = ref([]);
const selectedTicker = ref(null);
const graphData = ref([]);

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

async function getTickerInfo(ticker) {
  try {
    const response = await fetch(`https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=${ticker.name}-USD&api_key=${apiKey}`);
    const data = await response.json();
    const tickerValue = data.Data[ticker.name + '-USD'].VALUE;

    ticker.price = tickerValue > 2 ? tickerValue.toFixed(2) : tickerValue.toPrecision(2);

    if (selectedTicker.value && selectedTicker.value.name === ticker.name) { /* AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA */
      graphData.value.push(tickerValue);

      if (graphData.value.length > 20) {
        graphData.value.shift();
      }
    }
  } catch (err) {
    console.error('API error ' + err);
  }
}

async function updateTicker(ticker) {
  await getTickerInfo(ticker);
  setTimeout(() => updateTicker(ticker), 5000);
}

function handleAddTicker(tickerName) {
  if (tickers.value.find(ticker => ticker.name === tickerName)) {
    alert('Такой тикер уже есть');
    return;
  }

  const newTicker = ref({ id: id++, name: tickerName, price: '-' });
  tickers.value.push(newTicker.value);

  updateTicker(newTicker.value);
}

function handleDeleteTicker(ticker) {
  tickers.value = tickers.value.filter((toDeleteTicker) => ticker !== toDeleteTicker);
}

function handleSelectTicker(ticker) {
  selectedTicker.value = ticker;
  graphData.value = [];
  getTickerInfo(ticker);
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
