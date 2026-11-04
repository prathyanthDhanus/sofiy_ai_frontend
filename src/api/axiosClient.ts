import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request Interceptor: Attach Auth Token if present
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle response and format errors cleanly
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'

    if (error?.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    }

    return Promise.reject(new Error(message))
  }
)

export default axiosClient
