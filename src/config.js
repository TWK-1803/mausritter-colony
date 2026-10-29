// Override the API URL with VITE_API_URL in a .env.local file
export default {
  SERVER_API_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'
}
