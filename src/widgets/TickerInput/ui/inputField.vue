<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import addIcon from '../icons/addIcon.vue';
import suggestionList from './suggestionList.vue';
import LoadingScreen from './loadingScreen.vue';

const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

const props = defineProps({
  tickers: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['addTicker']);

const inputValue = ref('');
const loading = ref(false);
const alreadyExist = ref(false)

let allSymbols = [];
let suggestion = computed(() => {
  if (!inputValue.value) return []

  return allSymbols.map((item) => item.SYMBOL).filter((item) => item.startsWith(inputValue.value.toUpperCase())).slice(0, 4)
})

function submitTicker() {
  if (inputValue.value === '') return;

  if (props.tickers.find(ticker => ticker.name === inputValue.value.toUpperCase())) {
    alreadyExist.value = true
    return
  }

  emit('addTicker', inputValue.value.toUpperCase());
  inputValue.value = '';
}

const selectLastItem = (item) => {
  inputValue.value = item;
  submitTicker();
};

watch(inputValue, () => alreadyExist.value = false)

onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL&api_key=${apiKey}`
    );
    const data = await response.json();

    allSymbols = data.Data.LIST;
  } catch (err) {
    console.log('API Error! ' + err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <LoadingScreen v-if="loading" />
  <div style="display: inline-block;">
    <div class="ticker-input-container">
      <label for="tickerInput">Тикер</label>
      <input id="tickerInput" v-model.trim="inputValue" @keydown.enter="submitTicker" type="text"
        placeholder="Код валюты" maxlength="15" autocomplete="off" />
      <suggestionList :suggestions="suggestion" @select="selectLastItem" />
      <span v-if="alreadyExist" class="already-exists">Такой тикер уже существует!</span>
      <button @click="submitTicker" class="add-button">
        <add-icon /> Добавить
      </button>
    </div>
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


  & label {
    color: rgba(0, 0, 0, 0.767);
    font-weight: 500;
  }

  & .already-exists {
    color: red
  }

  & input {
    all: unset;
    width: 100%;
    z-index: 2;
    padding: 0.5rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }
}

.add-button {
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
</style>
