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
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(3, minmax(20rem, 1fr));
    place-self: center;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, minmax(20rem, 1fr));
    }
    @media (max-width: 800px) {
      grid-template-columns: repeat(1, minmax(20rem, 1fr));

      & .tickerCard {
        width: 100%;
      }
    }

    & .tickerCard {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background-color: white;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.375rem;
      padding-bottom: 0.3rem;
      cursor: pointer;
      height: fit-content;
      box-sizing: border-box;
      width: 20rem;

      @media (max-width: 800px) {
        width: 25rem;
      }

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
      gap: 0.225rem;
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
