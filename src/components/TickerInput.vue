<script setup>
import { ref, defineEmits } from 'vue'
import addIcon from '@/icons/addIcon.vue'

const emit = defineEmits(['addTicker'])
const inputValue = ref('')

const lastItems = ['BTC', 'DOGE', 'BCH', 'CHD']

function submitTicker() {
  if (inputValue.value.trim() === '') return

  emit('addTicker', inputValue.value.toUpperCase())
  inputValue.value = ''
}

function selectLastItem(item) {
  inputValue.value = item
}
</script>

<template>
  <div style="display: inline-block;">
    <div class="ticker-input-container">
      <label for="tickerInput">Тикер</label>
      <input id="tickerInput" v-model="inputValue" @keydown.enter="submitTicker" type="text" placeholder="Код валюты" />
      <div class="last-items">
        <span v-for="item in lastItems" :key="item" @click="selectLastItem(item)">{{ item }}</span>
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

.last-items {
  z-index: 1;
  display: flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
  background-color: white;
  gap: 0.5rem;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  margin-top: -1rem;
  padding: 0.5rem;
  padding-top: 1rem;

  & span {
    background-color: rgb(232, 243, 253);
    border-radius: 0.375rem;
    padding: 0.1rem 0.5rem;
    cursor: pointer;
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
  background-color: #4a5568;
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
