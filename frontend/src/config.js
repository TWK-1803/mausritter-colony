// The API URL can be overridden with VITE_API_URL (e.g. in frontend/.env.local).
// Otherwise the dev server (npm run serve, used by start.bat) talks to the local server
// and a production build talks to the deployed one.
const LOCAL_API_URL = 'http://127.0.0.1:3000/api'
const DEPLOYED_API_URL = 'https://mausritter-colony-server.vercel.app/api'

export default {
  SERVER_API_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? LOCAL_API_URL : DEPLOYED_API_URL)
}
