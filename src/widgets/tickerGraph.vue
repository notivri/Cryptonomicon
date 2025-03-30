<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>something - USD</h3>
      <button class="close-button">
        <baseButton id="close-button">
          <closeIcon @click="emit('closeGraph')" />
        </baseButton>
      </button>
    </div>
    <div ref="graph" class="graph">
      <div
        v-for="(bar, index) in props.graphData"
        :key="index"
        :style="[{ height: bar + '%' }]"
        class="bar"
      />
    </div>
  </div>
</template>

<script setup>
  import baseButton from "../shared/ui/baseButton.vue"
  import closeIcon from "../shared/icons/closeIcon.vue"

  const props = defineProps({
    graphData: {
      type: Array,
    },
  })
  const emit = defineEmits(["closeGraph"])
</script>

<style scoped>
  .graph-container {
    padding: 1rem;
    box-sizing: border-box;

    & .graph-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;

      & h3 {
        font-size: large;
        font-weight: 600;
      }

      & #close-button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        cursor: pointer;
        transition: 0.2s background-color;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }

    & .graph {
      border-left: 1px solid black;
      border-bottom: 1px solid black;
      margin-top: 1rem;
      display: flex;
      align-items: flex-end;
      gap: 0.3rem;
      padding: 0.2rem;
      height: 20rem;
      max-width: 100%;
      overflow-x: hidden;

      & .bar {
        display: flex;
        flex-wrap: nowrap;
        min-width: 2rem;
        max-width: calc(100% / 10);
        min-height: 0.5rem;
        background-color: rgba(85, 60, 154, 1);
      }
    }
  }
</style>
