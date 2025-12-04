import { Howl } from 'howler'
import p5 from 'p5'
import { InputManager } from './managers/InputManager.js'
import { GameLoader } from './managers/GameLoader.js'
import { UIManager } from './managers/UIManager.js'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const DEFAULT_BUFFER_SIZE = 3 // Keep 3 games loaded at all times

const GAME_DURATION = 5000 // 5sec

export class MircoEngine {
  constructor(container, options = {}) {
    this.container = container
    this.options = options
    this.gameLoopStarted = false
    this.currentGame = null

    // managers
    this.input = new InputManager()
    this.gameLoader = new GameLoader()
    this.ui = new UIManager(this.container, GAME_DURATION)
    this.gameLoader = new GameLoader(DEFAULT_BUFFER_SIZE)

    this.libs = {
      sound: {
        play: (sound) => {
          if (sound instanceof Howl) {
            sound.play()
          }
        },
        stop: (sound) => {
          if (sound instanceof Howl) {
            sound.stop()
          }
        },
      },
      // p5 is added separately between each game to prevent muddying p5 state
    }

    this.mirco = {
      round: 0,
      wins: 0,
      losses: 0,
    }
  }

  async init() {
    if (this.options.round) {
      this.mirco.round = parseInt(this.options.round)
      this.scoreOverlay.querySelector('.round').textContent =
        `Round: ${this.mirco.round}`
    }

    if (this.options.suppressSplash) {
      // hide splash, start gameplay
      this.ui.hideSplash()
    } else {
      // add event lister for handling splash
      this.listenForAnyKeyToStart()
    }
    const allGameManifests = await this.gameLoader.loadGameManifests(
      this.options
    )

    this.ui.updateDirectory(allGameManifests, this.options)

    if (this.options.suppressSplash) {
      // start gameplay rigth away
      this.triggerGameplayStart()
    }
  }

  triggerGameplayStart = () => {
    this.gameLoopStarted = true
    this.ui.hideSplash()
    this.playNext()
  }

  handleSplashInteraction = () => {
    if (!this.gameLoopStarted) {
      // remove all listeners
      window.removeEventListener('click', this.handleSplashInteraction)
      window.removeEventListener('keydown', this.handleSplashInteraction)

      // gamepad listener will unlisten itself
      this.triggerGameplayStart()
    }
  }

  listenForAnyKeyToStart = () => {
    // Add listeners
    window.addEventListener('click', this.handleSplashInteraction)
    window.addEventListener('keydown', this.handleSplashInteraction)

    // Gamepad input check
    this.waitForGamepadAnyInput()
  }

  waitForGamepadAnyInput = () => {
    if (this.gameLoopStarted) return
    if (this.isAnyGamepadButtonPressed()) {
      this.handleSplashInteraction()
      return
    }
    requestAnimationFrame(this.waitForGamepadAnyInput)
  }

  isAnyGamepadButtonPressed() {
    return this.input.gamepad.isAnyButtonPressed()
  }

  async playNext() {

    let next = this.gameLoader.getNextGame()
      
    if (!next) {
      console.error('Game buffer empty! Refilling...')
      await this.gameLoader.refillBuffer()
      next = this.gameLoader.getNextGame()
      if (!next) {
        console.error('Still no games after refill')
        return
      }
    }
    try  {

    const { p5, images } = await this.bootstrapP5(next.manifest)
  
    // Initialize game
    this.currentGame = new next.module.default({
      input: this.input,
      mirco: this.mirco,
      assets: { ...next.assets, ...images },
      libs: { ...this.libs, p5 },
    })

    // show instruction (timed) and author info
    this.ui.showGameInfo(next.manifest)

    this.currentGame.init(this.canvas)

    this.startGameLoop()

    // Automatically end game after time
    this.ui.gameTimer = setTimeout(() => {
      this.endGame(true) // todo: revist win by default
    }, GAME_DURATION)
  } catch(err) {
    console.error(`oh no there was a problem trying to play ${next.manifest?.name || 'un-named game'} \n failed with: \n ${err}`)
    this.ui.showErrorPlayingGame(next.manifest?.name || 'game')
    setTimeout(() => this.endGame(true), 3000)
  }
  }

  startGameLoop() {
    this.isRunning = true
    this.lastTime = performance.now()
    this.tick()
    this.ui.startTimer()
  }

  stopGameLoop() {
    this.isRunning = false
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }
  }

  tick(currentTime = performance.now()) {
    if (!this.isRunning || !this.currentGame) return

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Update current game
    this.currentGame.update?.(deltaTime)
    this.input.postUpdate()

    // Schedule next frame
    this.frameId = requestAnimationFrame((time) => this.tick(time))
  }

  endGame(won) {
    this.isRunning = false
    clearTimeout(this.ui.gameTimer)
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }
    // Call end on current game if it exists
    if (this.currentGame) {
      won = this.currentGame.end?.() || false
      this.updateScore(won)

      // Clean up game assets
      if (this.currentGame.assets) {
        Object.values(this.currentGame.assets).forEach((asset) => {
          // Dispose of Howl audio
          if (asset instanceof Howl) {
            asset.unload()
          }
        })
      }
      this.currentGame.libs.p5.remove()
      this.currentGame = null
    }

    // reset timer
    this.ui.resetTimer()

    // Schedule next game
    setTimeout(() => this.playNext(), 1000)
  }

  updateScore(won) {
    if (won) {
      this.mirco.wins++
    } else {
      this.mirco.losses++
    }
    this.ui.scoreOverlay.querySelector('.round').textContent =
      `Round: ${this.mirco.round}`
    this.ui.scoreOverlay.querySelector('.wins').textContent =
      `Wins: ${this.mirco.wins}`
    this.ui.scoreOverlay.querySelector('.losses').textContent =
      `Losses: ${this.mirco.losses}`
  }

  async bootstrapP5(manifest) {
   
    const theP5 = new p5((p) => {
      p.setup = () => {
        let type = manifest.is3D ? p.WEBGL : p.P2D
        const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, type )
        this.canvas = canvas
        canvas.parent(this.container)
        p.noLoop()
      }
    }, this.container)
    const images = await this.gameLoader.loadImages(manifest, theP5)

    theP5.setup()

    return { p5: theP5, images }
  }
}
