<template>
  <loadingScreen v-if="loading" />
  <main v-if="!loading" class="main">
    <tickerAdding
      v-model="userInput"
      :ticker-suggestions
      :is-existed
      @add-ticker="addTicker"
    />
    <hr />
    <tickerFilter
      v-model="filterInput"
      :is-next-page
      :is-previous-page
      @next-page="nextPage"
      @previous-page="previousPage"
    />
    <hr />
    <template v-if="tickers.length">
      <tickerGrid
        :paginated-tickers
        :selected-ticker
        @delete-ticker="deleteTicker"
        @select-ticker="selectTicker"
      />
      <hr />
      <tickerGraph v-if="selectedTicker" :graphData @close-graph="closeGraph" />
    </template>
  </main>
</template>

<script setup>
  import { getTickerData, getSuggestions } from "../entities/ticker/api/ticker"
  import loadingScreen from "../shared/ui/loadingScreen.vue"
  import tickerAdding from "../widgets/tickerAdding.vue"
  import tickerFilter from "../widgets/tickerFilter.vue"
  import tickerGrid from "../widgets/tickerGrid.vue"
  import tickerGraph from "../widgets/tickerGraph.vue"

  let interval = null

  const loading = ref(true)
  const tickers = ref([])
  const graphData = ref([])
  const userInput = ref("")
  const filterInput = ref("")
  const selectedTicker = ref(null)
  const tickerSuggestions = ref(null)
  const isExisted = ref(false)
  const isPreviousPage = ref(false)
  const isNextPage = ref(false)
  const currentPage = ref(1)

  const paginatedTickers = () => {
    const start = (currentPage.value - 1) * 6
    const end = currentPage.value * 6
    const filtered = tickers.value.filter((ticker) =>
      ticker.symbol.startsWith(filterInput.value.toUpperCase())
    )
    isPreviousPage.value = filtered.length < end
    isNextPage.value = filtered.length > end

    return filtered.slice(start, end)
  }

  const addTicker = () => {
    if (!userInput.value) return

    if (tickers.value.find((t) => t.symbol === userInput.value.toUpperCase())) {
      isExisted.value = true
      return
    }

    const newTicker = {
      symbol: userInput.value.toUpperCase(),
      currency: "USD",
      price: "-",
    }

    tickers.value.push(newTicker)
    userInput.value = ""
  }

  const deleteTicker = (toDeleteTicker) => {
    tickers.value = tickers.value.filter((ticker) => ticker !== toDeleteTicker)

    if (selectedTicker.value === toDeleteTicker) {
      selectedTicker.value = null
      graphData.value = []
    }
  }

  const selectTicker = (ticker) => {
    selectedTicker.value = ticker
    graphData.value = []
  }

  const closeGraph = () => {
    selectedTicker.value = null
    graphData.value = []
  }

  const nextPage = () => {
    currentPage.value++
  }

  const previousPage = () => {
    currentPage.value--
  }

  const updatePrices = async () => {
    for (const ticker of tickers.value) {
      try {
        const response = await getTickerData(ticker.symbol)

        if (response == "404") {
          deleteTicker(ticker)
          return
        }

        const tickerData = response[`${ticker.symbol}-USD`]
        const newTickerPrice =
          tickerData.VALUE > 2
            ? tickerData.VALUE.toFixed(2)
            : tickerData.VALUE.toPrecision(2)
        ticker.price = newTickerPrice

        if (selectedTicker.value === ticker) graphData.value.push(ticker.price)
      } catch (error) {
        console.error(`Ошибка при обновлении цены для ${ticker.symbol}:`, error)
      }
    }
  }

  watch(userInput, () => {
    if (isExisted.value) isExisted.value = false
  })

  watch(filterInput, () => {
    if (currentPage.value != 1) currentPage.value = 1
  })

  onMounted(() => {
    interval = setInterval(updatePrices, 10000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  onBeforeMount(async () => {
    try {
      loading.value = true
      const response = await getSuggestions()
      tickerSuggestions.value = response.LIST
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
  .main {
    background-color: whitesmoke;
    margin: 0.1rem;
    padding: 0.5rem;

    & hr {
      margin: 1rem;
      border: 0.1rem solid rgba(0, 0, 0, 0.5);
    }
  }
</style>
