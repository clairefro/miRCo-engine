export default class MircoGame {
  constructor({ input, assets, libs, mirco }) {
    /** Leave most of this stuff - it's to help you! */
    this.input = input
    this.assets = assets
    this.libs = libs
    this.mirco = mirco

    this.state = {
      // defaults
      gameOver: false,
      won: false, // set false = lose by default, true = win by default
    }
  }

  /** Create model */
  init(canvas) {
    // Initialize any custom game state


    // leave this - merges default state with your state
    this.state = { ...this.state, ...customState }
  }

  /** logic to update game state */
  update(dt) {
    // this function gets called every tick
    // dt is deltaTime - time between ticks
    const state = this.state

    if (state.gameOver) return // stop gameplay once win/lose

    // change state based on inputs

    /** do stuff with game state here - check for winning and losing! */


    // Reset position when releasing key
    if (!anyKeyPressed) {
      state.keyPressed = false
    }

    // IMPORTANT: call this method at the end of update()
    this.draw()
  }

  /** render visuals based on game state */
  draw() {
    const state = this.state
    const p5 = this.libs.p5 // you can draw with this if you want https://p5js.org/reference/

    /** Render stuff with p5.... */
    p5.background(220)

    if (!state.won) {

    } else {

    }

    if (state.gameOver) {

    }
  }

  // Return true if game is won, false if lost
  end() {
    return this.state.won
  }
}
