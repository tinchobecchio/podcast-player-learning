import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

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

// Shared authentication function
function generateAuthHeaders() {
    const apiHeaderTime = Math.floor(new Date().getTime() / 1000);
    const hash = crypto.createHash('sha1').update(authKey + secretKey + apiHeaderTime).digest('hex');
    return {
        'User-Agent': userAgent,
        'X-Auth-Key': authKey,
        'X-Auth-Date': apiHeaderTime.toString(),
        'Authorization': hash
    }
}

// Search for podcasts
app.get('/api/search', async(req,res) => {
    const query = req.query.q
    if (!query) {
        return res.status(400).json({error: 'Query Parameter is required'})
    }

    const headers = generateAuthHeaders()
    try {
        const response = await fetch(`${apiEndpoint}/search/byterm?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: headers
        })

        if (response.ok && response.headers.get('content-type').includes('application/json')) {
            const data = await response.json()
            res.json(data)
        } else {
            const rawText = await response.text()
            console.log('Raw Response:', rawText);
            res.status(500).json({error: 'Invalid response from API', rawText})
        }
        
    } catch (error) {
        console.error('Error fetching API: ', error)
        res.status(500).json({error: error.message})
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})