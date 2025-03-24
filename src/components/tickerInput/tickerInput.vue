<script setup>
import { ref, computed, watch, nextTick, onBeforeMount, } from 'vue';
import addIcon from '@/shared/icons/addIcon.vue';
import suggestionList from './ui/suggestionList.vue';
import loadingScreen from './ui/loadingScreen.vue';
import baseButton from '@/shared/ui/baseButton.vue';
import baseInput from '@/shared/ui/baseInput.vue';
import { getSuggestions } from '@/shared/api/api';

const userInput = ref('');
const isExists = ref(false)
const loading = ref(false)

let allTickers = [];
const suggestions = computed(() => {
  if (userInput.value == '') {
    return []
  }

  return allTickers.map((item) => Object({ symbol: item.SYMBOL, name: item.NAME, logo: item.LOGO_URL }))
    .filter((item) => item.symbol.startsWith(userInput.value.toUpperCase()))
    .slice(0, 4)
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

onBeforeMount(async () => {
  try {
    loading.value = true

    const response = await getSuggestions()

    allTickers = response.LIST
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
