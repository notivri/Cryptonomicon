<template>
  <div class="tickerAdding">
    <span class="label">Тикер</span>
    <div class="inputWrapper">
      <baseInput
        id="input"
        v-model="model"
        placeholder="Код Валюты"
        @keydown.enter="emit('addTicker')"
      />
      <div :class="['suggestions', { show: suggestedTickers.length }]">
        <span
          v-for="(suggestion, index) in suggestedTickers"
          :key="index"
          :title="suggestion.NAME"
          class="tickerSymbol"
          @click="emit('addTicker', suggestion.SYMBOL)"
        >
          <img
            :src="suggestion.LOGO_URL"
            width="16px"
            height="16px"
            class="tickerLogo"
          />
          {{ suggestion.SYMBOL }}
        </span>
      </div>
    </div>
    <span v-if="props.isExisted" id="existingMessage"
      >Такой тикер уже существует!</span
    >
    <baseButton id="addingButton" @click="emit('addTicker')">
      <addIcon />Добавить
    </baseButton>
  </div>
</template>

<script setup>
  import baseInput from "../shared/ui/baseInput.vue"
  import baseButton from "../shared/ui/baseButton.vue"
  import addIcon from "../shared/icons/addIcon.vue"

  const props = defineProps({
    tickerSuggestions: {
      type: Object,
    },
    isExisted: {
      type: Boolean,
    },
  })
  const model = defineModel()
  const emit = defineEmits(["addTicker"])

  const suggestedTickers = computed(() => {
    if (!model.value) return []

    return props.tickerSuggestions
      .filter((t) => t.SYMBOL.startsWith(model.value.toUpperCase()))
      .slice(0, 4)
  })
</script>

<style scoped>
  .label {
    font-weight: 600;
  }

  .tickerAdding {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 0.5rem;

    & #existingMessage {
      color: red;
      font-weight: 500;
    }

    & .suggestions {
      z-index: 1;
      display: none;
      position: relative;
      flex-direction: row;
      gap: 0.5rem;
      padding: 0.5rem;
      background-color: white;
      border-radius: 0.375rem;

      &.show {
        display: flex;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      }

      & .tickerLogo {
        border-radius: 100%;
        transition: transform 0.2s;

        &:hover {
          transform: scale(2);
        }
      }

      & .tickerSymbol {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.2rem;
        background-color: rgb(232, 243, 253);
        color: rgba(45, 55, 72, 1);
        border-radius: 0.25rem;
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
  }
</style>
