// src/utils/AxiosAuth.js
import axios from 'axios'
import { getRuntimeConfig } from '@/config/runtimeStore.js'

const api = axios.create()

// Attach baseURL after runtime config is loaded
api.interceptors.request.use(async (config) => {
    const runtimeConfig = getRuntimeConfig()
    config.baseURL = runtimeConfig.apiBaseUrl
    return config
})

// Optional: auth token interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
