import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') ?? ''

export const api = axios.create({ baseURL })

export function mediaUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (baseURL) return `${baseURL}${url}`
  return url
}
