<template>
  <loadingScreen v-if="loading" />
  <main v-else class="main">
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
      <tickerGraph
        v-if="selectedTicker"
        :graph-data
        :selected-ticker
        @close-graph="closeGraph"
      />
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
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(filtered.value.length / 6)
  })

  const isPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  const isNextPage = computed(() => {
    return currentPage.value * 6 < filtered.value.length
  })

  const start = computed(() => {
    return (currentPage.value - 1) * 6
  })

  const end = computed(() => {
    return currentPage.value * 6
  })

  const filtered = computed(() => {
    return tickers.value.filter((ticker) =>
      ticker.symbol.startsWith(filterInput.value.toUpperCase())
    )
  })

  const paginatedTickers = computed(() => {
    return filtered.value.slice(start.value, end.value)
  })

  const addTicker = (toAddTicker = userInput.value) => {
    if (!toAddTicker) return

    if (
      tickers.value.find(
        (ticker) => ticker.symbol === toAddTicker.toUpperCase()
      )
    ) {
      isExisted.value = true
      return
    }

    const newTicker = {
      symbol: toAddTicker.toUpperCase(),
      currency: "USD",
      price: "-",
    }

    tickers.value.push(newTicker)
    userInput.value = ""
    filterInput.value = ""
    currentPage.value = totalPages.value

    localStorage.setItem("tickers", JSON.stringify(tickers.value))
  }

  const deleteTicker = (toDeleteTicker) => {
    tickers.value = tickers.value.filter((ticker) => ticker !== toDeleteTicker)

    if (selectedTicker.value === toDeleteTicker) {
      selectedTicker.value = null
      graphData.value = []
    }

    if (!paginatedTickers.value.length) previousPage()
    console.log(paginatedTickers.value)

    localStorage.setItem("tickers", JSON.stringify(tickers.value))
  }

  const selectTicker = (ticker) => {
    selectedTicker.value = ticker
    graphData.value = []
  }

  const closeGraph = () => {
    selectedTicker.value = null
    graphData.value = []
  }

  const nextPage = () => currentPage.value++

  const previousPage = () => currentPage.value--

  const updatePrices = async () => {
    try {
      for (const ticker of tickers.value) {
        const response = await getTickerData(ticker.symbol)

        if (response === "404") {
          deleteTicker(ticker)
          console.warn(`${ticker.symbol} не найден!`)
          return
        }

        const tickerData = response[`${ticker.symbol}-${ticker.currency}`]
        const newTickerPrice = tickerData.VALUE
        const normalisedTickerPrice =
          newTickerPrice > 2
            ? newTickerPrice.toFixed(2)
            : newTickerPrice.toPrecision(2)

        ticker.price = normalisedTickerPrice

        if (selectedTicker.value === ticker) {
          const minutes = new Date().getMinutes()
          const seconds = new Date().getSeconds()

          graphData.value = [
            ...graphData.value,
            [`${minutes}:${seconds}`, normalisedTickerPrice],
          ]
        }

        if (graphData.value.length > 15) graphData.value.shift()
      }
    } catch (error) {
      console.error(`Error on update ticker: ${error}`)
    }
  }

  const updateURL = () => {
    const params = new URLSearchParams(window.location.search)

    if (filterInput.value) {
      params.set("filter", filterInput.value)
    } else {
      params.delete("filter")
    }

    params.set("page", currentPage.value)

    if (selectedTicker.value) {
      params.set("selected", selectedTicker.value.symbol)
    } else {
      params.delete("selected")
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    )
  }

  watch(userInput, () => {
    isExisted.value = false
  })

  watch(filterInput, () => {
    currentPage.value = 1
    updateURL()
  })

  watch(selectedTicker, () => {
    updateURL()
  })

  watch(currentPage, () => {
    updateURL()
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

  onMounted(() => {
    const tickersData = localStorage.getItem("tickers")
    if (tickersData) tickers.value = JSON.parse(tickersData)

    const params = new URLSearchParams(window.location.search)

    const filterData = params.get("filter")
    if (filterData) filterInput.value = filterData

    const pageData = params.get("page")
    if (pageData) currentPage.value = pageData

    const selectedTickerData = params.get("selected")
    if (selectedTickerData) {
      const selected = tickers.value.find(
        (ticker) => ticker.symbol == selectedTickerData
      )
      selectedTicker.value = selected
    }

    interval = setInterval(updatePrices, 10000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })
</script>

<style scoped>
  .main {
    background-color: whitesmoke;
    margin: 0.1rem;
    padding: 1rem;

    & .userInputWrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    & hr {
      margin: 1rem;
      border: 0.1rem solid rgba(0, 0, 0, 0.5);
    }
  }
</style>
