<template>
  <div class="tickerAddingContainer">
    <label for="input">Тикер</label>
    <div class="inputWrapper">
      <baseInput
        id="input"
        v-model="model"
        placeholder="Код Валюты"
        @keydown.enter="emit('addTicker')"
      />
      <div class="suggestions">
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

  const model = defineModel()
  const props = defineProps({
    tickerSuggestions: {
      type: Object,
    },
    isExisted: {
      type: Boolean,
    },
  })
  const emit = defineEmits(["addTicker"])

  const suggestedTickers = computed(() => {
    if (!model.value) return []

    return props.tickerSuggestions
      .filter((t) => t.SYMBOL.startsWith(model.value.toUpperCase()))
      .slice(0, 4)
  })
</script>

<style scoped>
  .tickerAddingContainer {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 0.5rem;

    & .inputWrapper {
      display: inline-flex;
      flex-direction: column;
    }

    & #existingMessage {
      color: red;
      font-weight: 500;
    }

    & .suggestions {
      z-index: 1;
      display: flex;
      position: relative;
      justify-content: flex-start;
      background-color: white;
      gap: 0.5rem;
      border-radius: 0 0 0.375rem 0.375rem;
      width: 20;

      padding: 0.5rem;
      padding-top: 1rem;
      transition: 0.5s transform;

      .tickerLogo {
        border-radius: 100%;
      }

      & .tickerSymbol {
        display: flex;
        align-items: center;
        gap: 0.1rem;
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
  }
</style>
