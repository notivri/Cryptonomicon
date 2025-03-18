<template>
  <div style="display: inline-block">
    <div class="ticker-container">
      <label for="wallet">Тикер</label>
      <input type="text" placeholder="Код валюты">
      <div class="last-items">
        <span>BTC</span>
        <span>DOGE</span>
        <span>BCH</span>
        <span>CHD</span>
      </div>
      <span style="color: red">Такой тикер уже есть</span>
    </div>
    <button id="addButton">
      <addIcon />Добавить
    </button>
  </div>
</template>

<script setup>
import "../app/styles/main.css"
import addIcon from '../app/icons/addIcon.vue';
</script>

<style>
.container {
  background-color: whitesmoke;
  width: 100%;
}

#addButton {
  all: unset;
  display: flex;
  align-items: center;
  color: white;
  background-color: #4a5568;
  gap: 0.5rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  padding-right: 1rem;
  padding-left: 1rem;
  border-radius: 2rem;
  transition: 0.2s background-color;

  &:hover {
    background-color: #5d6b83;
  }
}

.ticker-container {
  z-index: 1;
  position: relative;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* border: solid 1px black; */

  & label {
    color: rgba(0, 0, 0, 0.767);
    font-weight: 500;
  }

  & input {
    all: unset;
    width: 100%;
    padding: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }

  & .last-items {
    z-index: -1;
    padding: 0.5rem;
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: white;
    gap: 0.5rem;
    border-radius: 0 0 0.375rem 0.375rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    margin-top: -0.9rem;

    & span {
      border-radius: 0.375rem;
      background-color: rgb(232, 243, 253);
      padding: 0.1rem 0.5rem 0.1rem 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }
  }
}
</style>
