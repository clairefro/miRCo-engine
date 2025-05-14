export default class MircoGame {
  constructor({ input, assets, libs }) {
    /** Leave most of this stuff - it's to help you! */
    this.input = input;
    this.assets = assets;
    this.libs = libs;

    this.state = {
      // defaults
      gameOver: false,
      won: false, // set false = lose by default, true = win by default
    };
  }

  /** Create model */
  init(canvas) {
    // Initialize any custom game state
    const customState = {};

    // example:
    // const customState = {
    //   athlete: {
    //     x: canvas.width / 2 - 40,
    //     y: canvas.height - 100,
    //     width: 80,
    //     height: 80,
    //     isDown: true,
    //     sitUpCount: 0,
    //   },
    //   requiredSitUps: 5,
    //   lastKeyState: false,
    //   startTime: performance.now(),
    //   message: "",
    // };

    // leave this - merges default state with your state
    this.state = { ...this.state, ...customState };
  }

  /** logic to update game state */
  update(dt) {
    // this function gets called every tick
    // dt is deltaTime - time between ticks
    const state = this.state;

    /** do stuff with game state here - check for winning and losing! */
    // example
    // if (this.input.isPressedLeft()) {
    //     // Move left
    //   }
    //   if (this.input.isPressedRight()) {
    //     // Move right
    //   }
    //   if (this.input.isPressedUp()) {
    //     // Move up
    //   }
    //   if (this.input.isPressedDown()) {
    //     // Move down
    //   }
    // IMPORTANT: call this method at the end of update()
    this.draw();
  }

  /** render visuals based on game state */
  draw() {
    const state = this.state;
    const p5 = this.libs.p5; // you can draw with this if you want https://p5js.org/reference/

    /** Render stuff with p5.... */

    // p5.background(255);
    // p5.push();
    // p5.translate(
    //   state.athlete.x + state.athlete.width / 2,
    //   state.athlete.y + state.athlete.height / 2
    // );
    // p5.rotate(state.athlete.isDown ? 0 : -p5.PI / 4);
    // p5.imageMode(p5.CENTER);
    // p5.image(
    //   this.assets["situp.png"],
    //   0,
    //   0,
    //   state.athlete.width,
    //   state.athlete.height
    // );
    // p5.pop();

    // // Draw counter
    // p5.textSize(24);
    // p5.textAlign(p5.LEFT);
    // p5.fill(0);
    // p5.text(
    //   `Sit-ups: ${state.athlete.sitUpCount}/${state.requiredSitUps}`,
    //   10,
    //   30
    // );

    // if (state.gameOver) {
    //   p5.textSize(48);
    //   p5.textAlign(p5.CENTER);
    //   p5.fill(0, 255, 0); // green
    //   p5.text(state.message, p5.width / 2, p5.height / 2);
    // }
  }

  /** return true if game is won, false if lost */
  end() {
    return this.state.won;
  }
}
