export default class MircoGame {
  constructor({ input, assets, libs, mirco }) {
    this.input = input
    this.assets = assets
    this.libs = libs
    this.mirco = mirco

    this.lookup = {
      '⬆️': this.input.isPressedUp,
      '⬇️': this.input.isPressedDown,
      '⬅️': this.input.isPressedLeft,
      '➡️': this.input.isPressedRight,
    }

    this.state = {
      // defaults
      gameOver: false,
      won: false, // defaulting to false = lose by default, true = win by default
    }
  }

  /** Create model */
  init(canvas) {
    // Initialize any game state
    var options = ['⬆️', '⬇️', '⬅️', '➡️']
    this.shuffle(options)
    // options.pop()

    console.log('\n\n\n\n')
    console.log('options: ', options)

    const customState = {
      startTime: performance.now(),
      message: '',
      number: 0,
      sequence: options,
      lastKeyState: false,
      lastChangeTime: 0,
      debounceTime: 100,
    }

    this.state = { ...this.state, ...customState }
  }

  /** logic to update game state */
  update(dt) {
    const currentTime = Date.now()
    const state = this.state

    if (state.gameOver) {
      // IMPORTANT: call this method here too lol
      this.draw()
      return
    }

    if (state.number >= state.sequence.length) {
      state.gameOver = true
      state.message = 'Winner!'
      state.won = true
      return
    }

    var target = state.sequence[state.number]
    var targetFunction = this.lookup[target]

    var targetPressed = targetFunction()
    console.log(
      'target:',
      target,
      'targetPressed:',
      targetPressed,
      'lastKeyState:',
      state.lastKeyState
    )

    if (targetPressed === false && state.lastKeyState === true) {
      if (currentTime - state.lastChangeTime > state.debounceTime) {
        state.lastKeyState = false
        state.lastChangeTime = currentTime

        console.log('Button Released')
        state.number++
        return
      }
    }
    if (targetPressed === true && state.lastKeyState === false) {
      this.input.gamepad.pulse()
      state.lastKeyState = true
      state.lastChangeTime = Date.now()
      return
    }

    var funcs = [
      this.input.isPressedLeft,
      this.input.isPressedRight,
      this.input.isPressedUp,
      this.input.isPressedDown,
    ]
    var i = funcs.indexOf(targetFunction)
    funcs.splice(i, 1)

    for (var j = 0; j < funcs.length; j++) {
      if (funcs[j]()) {
        console.log('Wrong button pressed')
        state.gameOver = true
        state.message = 'Wrong!'
        state.won = false
        return
      }
    }

    // IMPORTANT: call this method at the end of update()
    this.draw()
  }

  /** render visuals based on game state */
  draw() {
    const state = this.state
    const p5 = this.libs.p5

    // console.log("state.gameOver: ", state.gameOver)

    p5.background(255)

    p5.textSize(80)
    p5.textAlign(p5.CENTER, p5.CENTER)
    var s = ''
    for (var i = 0; i < state.sequence.length; i++) {
      if (i == state.number) {
        s += '✨' + state.sequence[i] + '✨'
      } else {
        s += state.sequence[i]
      }
      if (i != state.sequence.length - 1) {
        s += '\n'
      }
    }
    p5.text(s, p5.width / 2, p5.height / 2)

    if (state.gameOver) {
      p5.textSize(48)
      p5.textAlign(p5.CENTER)
      p5.fill(0, 255, 0) // green
      p5.text(state.message, p5.width / 2, p5.height / 2)
    }
  }

  /** return true if game is won, false if lost */
  end() {
    return this.state.won
  }

  shuffle(array) {
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }
  }
}
