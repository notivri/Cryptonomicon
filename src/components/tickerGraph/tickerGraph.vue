<script setup>
import closeButton from '@/shared/icons/closeButton.vue';

const props = defineProps({
  graphData: {
    type: Array,
    required: true,
  },
  tickerName: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['closeGraph'])

function normalizedGraph() {
  const maxValue = Math.max(...props.graphData);
  const minValue = Math.min(...props.graphData);

  return props.graphData.map((value) => ((value - minValue) * 100) / (maxValue - minValue));
}

</script>

<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ tickerName }} - USD</h3>
      <button @click="emits('closeGraph')" class="close-button">
        <close-button />
      </button>
    </div>
    <div class="graph" ref="graph">
      <div v-for="(bar, idx) in normalizedGraph()" :key="idx" class="bar" :style="{ height: bar + '%' }"></div>
    </div>
  </div>
</template>

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

    & .close-button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      cursor: pointer;
      transition: 0.2s background-color;

      &:hover {
        background-color: rgba(0, 0, 0, 0.100);
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
