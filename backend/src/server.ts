import app from './app.js'

import { env } from './config/env.js'

app.listen(env.port, () => {
  console.log(`KHOJ INDIA backend running on port ${env.port}`)
})