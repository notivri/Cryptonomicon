<script setup>
import { ref, onMounted, computed, watch, nextTick, } from 'vue';
import addIcon from '@/shared/icons/addIcon.vue';
import suggestionList from './ui/suggestionList.vue';
import loadingScreen from './ui/loadingScreen.vue';
import baseButton from '@/shared/ui/baseButton.vue';
import baseInput from '@/shared/ui/baseInput.vue';

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

const userInput = ref('');
const isExists = ref(false)
const loading = ref(false)
let allSymbols = [];
let suggestions = computed(() => {
  if (userInput.value == '') {
    return []
  }

  return allSymbols.map((item) => {
    return { symbol: item.SYMBOL, name: item.NAME, logo: item.LOGO_URL }
  }).filter((item) => item.symbol.startsWith(userInput.value.toUpperCase())).slice(0, 4)
})

const props = defineProps({
  tickers: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['addTicker']);

const addTicker = async () => {
  await nextTick()

  if (props.tickers.find(ticker => ticker.name == userInput.value.toUpperCase())) {
    isExists.value = true
    return
  }

  emit('addTicker', userInput.value.toUpperCase());
  userInput.value = '';
}

const handleSelectSuggestion = (suggest) => {
  userInput.value = suggest
  addTicker()
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await fetch(
      `https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL&api_key=${apiKey}`
    );
    const data = await response.json();

    allSymbols = data.Data.LIST;
  } catch (err) {
    console.log('API Error! ' + err);
  } finally {
    loading.value = false
  }
});

watch(userInput, () => {
  isExists.value = false
})
</script>

<template>
  <loadingScreen v-if="loading" />
  <div class="ticker-input-container">
    <span>Тикер</span>
    <div class="input-block">
      <baseInput v-model.trim="userInput" @keydown.enter="addTicker" placeholder="Код валюты" class="baseInput"
        style="max-width: 100%;" />
      <suggestionList :suggestions @selectSuggestion="handleSelectSuggestion" class="suggestionList" />
      <span v-if="isExists" class="exists">Такой тикер уже существует!</span>
    </div>
    <baseButton class="addButton" @click="addTicker">
      <addIcon /> Добавить
    </baseButton>
  </div>
</template>

<style scoped>
.ticker-input-container {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;

  & .input-block {
    display: inline-flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  & span {
    color: rgba(0, 0, 0, 0.767);
    font-weight: 500;
  }

  & .exists {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    color: red
  }

  & .addButton {
    margin-top: 0.5rem;
  }
}
</style>
