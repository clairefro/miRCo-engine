import { Howl } from 'howler'

export class GameLoader {
  constructor(bufferSize = 3) {
    this.BUFFER_SIZE = bufferSize
    this.loadedGames = []
    this.gameManifestsQueue = []
    this.allGameManifests = []

    this.loadGameManifests = this.loadGameManifests.bind(this)
    this.refillBuffer = this.refillBuffer.bind(this)
    this.preloadAssets = this.preloadAssets.bind(this)
    this.loadImages = this.loadImages.bind(this)
    this.loadAudio = this.loadAudio.bind(this)
    this.assetConf = this.assetConf.bind(this)
    this.shuffleArray = this.shuffleArray.bind(this)
    this.getNextGame = this.getNextGame.bind(this)
  }

  async loadGameManifests(options = {}) {
    const res = await fetch('/api/games')
    let manifests = await res.json()
    manifests = manifests.filter((m) =>
      options.game ? options.game === m.name : true
    )

    this.BUFFER_SIZE = Math.min(3, manifests.length)
    this.allGameManifests = [...manifests]
    this.gameManifestsQueue = this.shuffleArray([...manifests])

    await this.refillBuffer()
    return this.allGameManifests
  }

  async refillBuffer() {
    while (this.loadedGames.length < this.BUFFER_SIZE) {
      if (this.gameManifestsQueue.length === 0) {
        this.gameManifestsQueue = this.shuffleArray([...this.allGameManifests])
        if (this.gameManifestsQueue.length === 0) {
          console.error('No games left to queue. Stopping buffer refill.')
          return
        }
      }

      const nextManifest = this.gameManifestsQueue.shift()
      if (!nextManifest) continue

      try {
        const [mod, assets] = await Promise.all([
          import(`/games/${nextManifest.name}/index.js`),
          this.preloadAssets(nextManifest),
        ])

        this.loadedGames.push({
          manifest: nextManifest,
          module: mod,
          assets,
        })
      } catch (err) {
        console.error(`Failed to load ${nextManifest.name || 'as no manifest name has been provided'}:`, err)
      }
    }
  }

  async preloadAssets(manifest) {
    const assets = {}
    const basePath = `/games/${manifest.name}/assets/`

    for (const conf of manifest.assets || []) {
      const { filename, options } = this.assetConf(conf)
      if (!filename) continue

      if (filename.endsWith('.mp3') || filename.endsWith('.wav')) {
        assets[filename] = await this.loadAudio(basePath + filename, options)
      }
    }

    return assets
  }

  async loadImages(manifest, p5) {
    const result = {}
    const basePath = `/games/${manifest.name}/assets/`

    for (const conf of manifest.assets || []) {
      const { filename } = this.assetConf(conf)

      if (!filename) {
        console.warn(`Unable to load asset for game ${manifest.name}`, conf)
        continue
      }

      if (filename.endsWith('.png') || filename.endsWith('.jpg')) {
        const img = new Image()
        img.src = basePath + filename
        await img.decode()
        result[filename] = await new Promise((resolve) => {
          p5.loadImage(basePath + filename, (img) => {
            resolve(img)
          })
        })
      }
    }
    return result
  }
  async loadAudio(path, options = {}) {
    const sound = new Howl({
      src: [path],
      preload: true,
      ...options,
    })

    return new Promise((resolve, reject) => {
      sound.once('load', () => resolve(sound))
      sound.once('loaderror', reject)
    })
  }

  assetConf(conf) {
    let filename, options

    if (typeof conf === 'string') {
      filename = conf
      options = {}
    } else {
      const { file, ...rest } = conf
      filename = file
      options = rest
    }

    return { filename, options }
  }

  shuffleArray(arr) {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  getNextGame() {
    const next = this.loadedGames.shift()
    this.refillBuffer().catch((err) =>
      console.error('Failed to refill buffer:', err)
    )
    return next
  }
}
