<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ props.selectedTicker.symbol }} - USD</h3>
      <button class="close-button">
        <baseButton id="close-button">
          <closeIcon @click="emit('closeGraph')" />
        </baseButton>
      </button>
    </div>
    <div ref="graph" class="graph">
      <Line :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup>
  import baseButton from "../shared/ui/baseButton.vue"
  import closeIcon from "../shared/icons/closeIcon.vue"
  import { Line } from "vue-chartjs"
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
  } from "chart.js"

  ChartJS.register(
    Title,
    Tooltip,
    Filler,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  const chartData = computed(() => {
    return {
      labels: props.graphData.map((data) => data[0]),
      datasets: [
        {
          label: "BTC",
          fill: true,
          pointHitRadius: 10,
          pointBackgroundColor: "rgba(85, 60, 154, 1)",
          backgroundColor: "rgba(85, 60, 154, 0.5)",
          borderColor: "rgba(85, 60, 154, 1)",
          data: props.graphData.map((data) => data[1]),
        },
      ],
    }
  })

  const props = defineProps({
    graphData: {
      type: Object,
    },
    selectedTicker: {
      type: Object,
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
      margin-top: 1rem;
      width: 100%;
      height: clamp(15rem, 40vh, 20rem);
    }
  }
</style>
