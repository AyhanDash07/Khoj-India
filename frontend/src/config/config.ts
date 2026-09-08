import { APP_NAME } from './constants'

const config = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  appName: APP_NAME,

  environment:
    import.meta.env.MODE || 'development',
}

export default config