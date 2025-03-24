import { ref, watch } from 'vue'
import { getTickerData } from '@/shared/api/api.js'

const tickers = ref([])
const selectedTicker = ref(null)
const graphData = ref([])
const currentPage = ref(1)
const hasNextPage = ref(false)
const filter = ref('')
const loading = ref(false)
const allTickers = ref([])
const maxGraphElements = ref(32)

const requestInterval = 500
const maxVisibleCards = 6
const minNumberThreshold = 2
const bigNumberRounding = 2
const smallNumberRounding = 2

const filteredTickers = () => {
  const start = (currentPage.value - 1) * maxVisibleCards
  const end = currentPage.value * maxVisibleCards
  const filtered = tickers.value.filter((ticker) =>
    ticker.name.startsWith(filter.value.toUpperCase()),
  )

  hasNextPage.value = filtered.length > end

  return filtered.slice(start, end)
}

const updateTickers = async () => {
  tickers.value.forEach(async (ticker) => {
    try {
      const response = await getTickerData(ticker.name)
      const newValue = response[`${ticker.name}-USD`].VALUE
      const normalizedValue =
        newValue > minNumberThreshold
          ? newValue.toFixed(bigNumberRounding)
          : newValue.toPrecision(smallNumberRounding)

      ticker.value = normalizedValue

      if (selectedTicker.value === ticker) {
        graphData.value.push(ticker.value)
      }
      if (graphData.value.length > Math.floor(maxGraphElements.value)) {
        graphData.value.shift()
      }
    } catch (error) {
      if (error.response?.status === 404) {
        handleDeleteTicker(ticker)
      }
    }
  })
}

const handleAddTicker = (tickerName) => {
  const newTicker = { name: tickerName, value: '-' }
  tickers.value.push(newTicker)
  filter.value = ''
  localStorage.setItem('cryptonomicon-list', JSON.stringify(tickers.value))
}

const handleDeleteTicker = (ticker) => {
  tickers.value = tickers.value.filter((t) => t !== ticker)
  localStorage.setItem('cryptonomicon-list', JSON.stringify(tickers.value))

  if (selectedTicker.value === ticker) {
    selectedTicker.value = null
  }
}

const handleSelectTicker = (ticker) => {
  selectedTicker.value = ticker
  graphData.value = []
}

const handleCloseGraph = () => {
  selectedTicker.value = null
  graphData.value = []
}

watch(tickers, () => {
  if (tickers.value.length >= 1) {
    setInterval(updateTickers, requestInterval)
  } else {
    selectedTicker.value = null
    graphData.value = []
  }
})

export {
  // \/ values \/
  tickers,
  selectedTicker,
  graphData,
  currentPage,
  hasNextPage,
  filter,
  loading,
  allTickers,
  maxGraphElements,
  // \/ functions \/
  updateTickers,
  handleAddTicker,
  handleDeleteTicker,
  handleSelectTicker,
  handleCloseGraph,
  filteredTickers,
}
