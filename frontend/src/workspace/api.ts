import axios from 'axios'

const instance = axios.create({
  baseURL: location.protocol + '//' + location.host + '/api/v1/'
})

export const exactApi = axios.create()

instance.defaults.headers.common['Authorization'] = (window as any).API_TOKEN
exactApi.defaults.headers.common['Authorization'] = (window as any).API_TOKEN

export default instance
