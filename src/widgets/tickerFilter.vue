<template>
  <section class="tickerFilter">
    <baseInput v-model="model" />
    <div class="buttonContainer">
      <baseButton
        id="backwardButton"
        :disabled="!props.isPreviousPage"
        class="baseButton"
        @click="emit('previousPage')"
      >
        <arrowIcon />
      </baseButton>
      <baseButton
        id="forwardButton"
        :disabled="!props.isNextPage"
        class="baseButton"
        @click="emit('nextPage')"
      >
        <arrowIcon />
      </baseButton>
    </div>
  </section>
</template>

<script setup>
  import baseInput from "../shared/ui/baseInput.vue"
  import baseButton from "../shared/ui/baseButton.vue"
  import arrowIcon from "../shared/icons/arrowIcon.vue"

  const model = defineModel()

  const props = defineProps({
    isPreviousPage: {
      type: Boolean,
    },
    isNextPage: {
      type: Boolean,
    },
  })

  const emit = defineEmits(["previousPage", "nextPage"])
</script>

<style scoped>
  .tickerFilter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;

    & .baseButton {
      border-radius: 100%;
      padding: 0.7rem;
    }

    & .buttonContainer {
      display: flex;
      gap: 0.5rem;

      & #backwardButton {
        transform: rotate(180deg);
      }

      & #backwardButton,
      #forwardButton {
        :disabled {
          background-color: #0d0d0d80;
        }
      }
    }
  }
</style>
