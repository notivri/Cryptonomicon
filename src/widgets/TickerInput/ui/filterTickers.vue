<script setup>
import { ref } from "vue";

const props = defineProps({
  tickers: {
    type: Array,
    required: true
  }
})

const currectPage = ref(1)
const filter = ref('')

const filteredList = () => {
  return props.tickers.value.filter((ticker) => ticker.name.includes(filter.value))
}
</script>

<template>
  <hr>
  <div class="container">
    <button>Назад</button> <button>Вперед</button> <input type="text" v-model="filter" />
  </div>
</template>

<style scoped>
.container {
  display: inline-flex;
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
