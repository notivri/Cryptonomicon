<script setup>
import { ref, onMounted, watch } from 'vue'
import addIcon from '@/icons/addIcon.vue'
import LoadingIcon from '@/icons/loadingIcon.vue';
const apiKey = import.meta.env.VITE_COINDESK_API_KEY;

const emit = defineEmits(['addTicker'])
const inputValue = ref('')
const loading = ref(false)
let allSymbols = []
let suggestion = ref([])

function submitTicker() {
  if (inputValue.value === '') return

  emit('addTicker', inputValue.value.toUpperCase())
  inputValue.value = ''
}

const selectLastItem = (item) => {
  inputValue.value = item;
  submitTicker()
}

watch(inputValue, (newInput) => {
  if (!newInput) {
    suggestion.value = []
    return
  }

  suggestion.value = allSymbols
    .map(s => s.SYMBOL)
    .filter(symbol => symbol.startsWith(newInput.toUpperCase()))
    .slice(0, 4)
})


onMounted(async () => {
  try {
    loading.value = true

    const response = await fetch(`https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL&api_key=${apiKey}`)
    const data = await response.json()

    allSymbols = data.Data.LIST
  }
  catch (err) {
    console.log('API Error! ' + err)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <template v-if="loading">
    <div class="loadingScreen">
      <LoadingIcon class="loadingIcon" />
    </div>
  </template>
  <div style="display: inline-block;">
    <div class="ticker-input-container">
      <label for="tickerInput">Тикер</label>
      <input id="tickerInput" v-model.trim="inputValue" @keydown.enter="submitTicker" type="text"
        placeholder="Код валюты" autocomplete="off" />
      <div class="suggestions">
        <span v-for="item in suggestion" :key="item" @click="selectLastItem(item)">{{ item }}</span>
      </div>
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

.suggestions {
  z-index: 1;
  display: flex;
  width: 100%;
  position: relative;
  justify-content: flex-start;
  background-color: white;
  gap: 0.5rem;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  margin-top: -1rem;
  padding: 0.5rem;
  padding-top: 1rem;

  & span {
    background-color: rgb(232, 243, 253);
    color: rgba(45, 55, 72, 1);
    border-radius: 0.375rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: 0.2s background-color;

    &:hover {
      background-color: rgb(215, 228, 240);
    }
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

.loadingScreen {
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(85, 60, 154, 1);

  & .loadingIcon {
    animation: 1s linear 0s infinite normal none running loading;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(+360deg);
  }
}
</style>
