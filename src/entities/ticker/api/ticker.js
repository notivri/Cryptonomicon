const API_BASE_URL = "https://data-API.coindesk.com/"
const API_KEY = import.meta.VITE_API_KEY

const getTickerData = async (ticker, currency = "USD") => {
  const url = new URL("/index/cc/v1/latest/tick", API_BASE_URL)
  url.searchParams.append("market", "ccix")
  url.searchParams.append("instruments", `${ticker}-${currency}`)
  url.searchParams.append("API_Key", API_KEY)

  try {
    const response = await fetch(url, { method: "GET" })

    if (!response.ok) {
      if (response.status == 404) {
        return "404"
      }

      throw new Error(`API error: ${response.status} ${await response.text()}`)
    }

    const data = await response.json()
    return data.Data
  } catch (error) {
    console.error("Fetch error: ", error)
    throw error
  }
}

const getSuggestions = async () => {
  const url = new URL("/asset/v1/summary/list", API_BASE_URL)
  url.searchParams.append("asset_lookup_priority", "SYMBOL")
  url.searchParams.append("API_Key", API_KEY)

  try {
    const response = await fetch(url, { method: "GET" })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`)
    }

    const data = await response.json()
    return data.Data
  } catch (error) {
    console.error("Fetch error: ", error)
    throw error
  }
}

export { getTickerData, getSuggestions }
