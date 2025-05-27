import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const app = express()
const PORT = 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// TODO: make the game path dynamic - or consider fetching games from remote
const MICROGAMES_DIR = path.resolve(__dirname, './games')

console.log({ MICROGAMES_DIR })

// serve game assets
app.use('/games', express.static(MICROGAMES_DIR))

app.get('/api/games', async (req, res) => {
  try {
    const dirs = await fs.readdir(MICROGAMES_DIR, { withFileTypes: true })
    const gameModules = await Promise.all(
      dirs
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const manifestPath = path.join(
            MICROGAMES_DIR,
            dirent.name,
            'manifest.json'
          )
          try {
            const {assets = [], author, authorLink, instruction, is3D} = JSON.parse(
              await fs.readFile(manifestPath, 'utf-8')
            )
            return {
              assets,
              author,
              authorLink,
              instruction,
              is3D,
              name: dirent.name,
              path: `/games/${dirent.name}/index.js`,
            }
          } catch (err) {
            console.error(`Error loading manifest for ${dirent.name}:`, err)
            return {
              name: dirent.name,
              path: `/games/${dirent.name}/index.js`,
              assets: [],
            }
          }
        })
    )
    res.json(gameModules)
  } catch (err) {
    res.status(500).json({ error: 'Failed to list game modules' })
  }
})

// only serve client from backend in prod (use vite dev server in development)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'dist')
  app.use(express.static(distPath)) // serve dist bundle at root

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html')) // also serve index.html for all unmatched routes
  })
} else {
  console.log('Running in development mode')
}

app.listen(PORT, () => {
  console.log(`GameManager running at http://localhost:${PORT}`)
})

export { app }
