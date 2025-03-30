<template>
  <div class="tickerGrid">
    <div
      v-for="(ticker, index) in props.paginatedTickers"
      :key="index"
      :class="['tickerCard', { selected: ticker === props.selectedTicker }]"
      @click="emit('selectTicker', ticker)"
    >
      <div class="cardHeader">
        <dt>{{ ticker.symbol }} - {{ ticker.currency }}</dt>
        <dd>{{ ticker.price }}</dd>
      </div>
      <button id="deleteButton" @click.stop="emit('deleteTicker', ticker)">
        <deleteIcon />Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
  import deleteIcon from "../shared/icons/deleteIcon.vue"

  const props = defineProps({
    paginatedTickers: {
      type: Object,
    },
    selectedTicker: {
      type: Object,
    },
  })

  const emit = defineEmits([["deleteTicker", "selectTicker"]])
</script>

<style scoped>
  .tickerGrid {
    padding-left: 1rem;
    padding-right: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 0.5rem;

    & .tickerCard {
      display: flex;
      justify-self: center;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      max-width: 30rem;
      min-width: 20rem;
      background-color: white;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.375rem;
      padding-bottom: 0.5rem;
      cursor: pointer;
      box-sizing: border-box;

      & .cardHeader {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;

        & dt {
          color: rgba(0, 0, 0, 0.418);
          font-size: 1rem;
          font-weight: 700;
        }

        & dd {
          font-size: 2rem;
          font-weight: 500;
        }
      }
    }

    #deleteButton {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
      width: 100%;
      color: rgba(113, 128, 150, 1);
      background-color: whitesmoke;
      font-weight: 600;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgb(228, 228, 228);
      }
    }

    .selected {
      outline: 0.3rem solid rgba(85, 60, 154, 1);
    }
  }
</style>
