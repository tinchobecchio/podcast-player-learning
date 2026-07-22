import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

const authKey = process.env.AUTH_KEY
const secretKey = process.env.SECRET_KEY
const userAgent = process.env.USER_AGENT
const apiEndpoint = process.env.API_ENDPOINT

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})