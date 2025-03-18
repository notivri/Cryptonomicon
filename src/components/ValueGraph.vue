<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import closeButton from '@/icons/closeButton.vue';

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

const maxColumns = ref(32); // Максимальное количество столбцов
const columnWidth = ref('2rem'); // Начальная ширина столбца

const normalizedGraph = computed(() => {
  const maxValue = Math.max(...props.graphData);
  const minValue = Math.min(...props.graphData);

  return props.graphData.map((value) => ((value - minValue) * 100) / (maxValue - minValue));
});

function updateColumnWidth() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    maxColumns.value = 15;
    columnWidth.value = '1rem';
  } else if (screenWidth < 1024) {
    maxColumns.value = 24;
    columnWidth.value = '1.5rem';
  } else {
    maxColumns.value = 32;
    columnWidth.value = '2rem';
  }
}

onMounted(() => {
  updateColumnWidth();
  window.addEventListener('resize', updateColumnWidth);
});
</script>

<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ tickerName }} - USD</h3>
      <button @click="$emit('close')" class="close-button">
        <close-button />
      </button>
    </div>
    <div class="graph">
      <div v-for="(bar, idx) in normalizedGraph" :key="idx" class="bar"
        :style="{ height: bar + '%', width: columnWidth }"></div>
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
    min-height: 15rem;
    gap: 0.3rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.2rem;
    height: 20rem;
  }

  & .bar {
    min-height: 0.5rem;
    background-color: rgba(85, 60, 154, 1);
  }
}
</style>
