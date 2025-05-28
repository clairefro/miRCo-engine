export default class MircoGame {
  constructor({ input, assets, libs, mirco }) {
    this.input = input
    this.assets = assets
    this.libs = libs
    this.mirco = mirco // { round: number, wins: number, losses: number }

    this.state = {
      gameOver: false,
      won: false,
    }
  }


  init(canvas) {
    // let bottle = this.libs.canvasContext.loadModel('/games/lemonade/assets/bottle.obj');
    // let bottleOpener = this.libs.canvasContext.loadModel('/games/lemonade/assets/bottleOpener.obj');

    let customState = {
      // bottle,
      // bottleOpener,
      startTime: performance.now(),
      message: "I'm thirsty",
    };

    // leave this - merges default state with your state
    this.state = { ...this.state, ...customState }
  }

  /** logic to update game state */
  update(dt) {
    const state = this.state

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
    this.draw()
  }

  /** render visuals based on game state */
  draw() {
    const state = this.state

    const p5 = this.libs.p5 // you can draw with this if you want https://p5js.org/reference/
    p5.background(0)
    p5.ambientLight(64, 156, 255);
    p5.orbitControl();
  // Begin transformation stack
    p5.push();
    p5.translate(10, 0, 0);
    p5.box(200);
    p5.ambientMaterial(255, 255, 0);
    p5.pop(); // Reset to previous matrix

    p5.push();
    p5.translate(10, 0, 0);
    p5.noStroke();
    p5.fill('green')
    p5.rect(p5.mouseX - 400, p5.mouseY - 300, 200, 200);
    p5.pop();
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

    // }
  }

  /** return true if game is won, false if lost */
  end() {
    return this.state.won
  }
}
