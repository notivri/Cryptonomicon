import axios from 'axios'

const API = axios.create({
  baseURL: 'https://data-API.coindesk.com/',
  params: {
    API_Key: import.meta.VITE_API_KEY,
  },
})

API.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('API error: ', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Request error: ', error.request)
    } else {
      console.error('Error config: ', error.config)
    }

    throw error
  },
)

const getTickerData = async (ticker, currency = 'USD') => {
  const response = await API.get('/index/cc/v1/latest/tick', {
    params: {
      market: 'ccix',
      instruments: `${ticker}-${currency}`,
    },
  })

  return response.data.Data
}

const getSuggestions = async () => {
  const response = await API.get('/asset/v1/summary/list', {
    params: {
      asset_lookup_priority: 'SYMBOL',
    },
  })

  return response.data.Data
}

export { getTickerData, getSuggestions }
