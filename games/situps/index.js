export default class MircoGame {
  constructor({ input, assets, libs }) {
    this.input = input;
    this.assets = assets;
    this.libs = libs;

    this.state = {
      // defaults
      gameOver: false,
      won: false, // defaulting to false = lose by default, true = win by default
    };
  }

  /** Create model */
  init(canvas) {
    // Initialize any game state
    const customState = {
      athlete: {
        x: canvas.width / 2 - 40,
        y: canvas.height - 100,
        width: 80,
        height: 80,
        isDown: true,
        sitUpCount: 0,
      },
      requiredSitUps: 5,
      lastKeyState: false,
      startTime: performance.now(),
      message: "",
    };

    this.state = { ...this.state, ...customState };
  }

  /** logic to update game state */
  update(dt) {
    const state = this.state;

    if (state.gameOver) return; // stop gameplay once win/lose

    // change state based on inputs
    var upPressed = this.input.isPressedUp();

    // Only count a sit-up when transitioning from down to up
    if (upPressed && !state.lastKeyState && state.athlete.isDown) {
      state.athlete.sitUpCount++;
      state.athlete.isDown = false;

      this.libs.sound.play(this.assets["fart.mp3"]);

      if (state.athlete.sitUpCount >= state.requiredSitUps) {
        state.gameOver = true;
        state.message = "Winner!";
        state.won = true;
      }
    }

    // Reset position when releasing space
    if (!upPressed) {
      state.athlete.isDown = true;
    }

    state.lastKeyState = upPressed;

    // IMPORTANT: call this method at the end of update()
    this.draw();
  }

  /** render visuals based on game state */
  draw() {
    const state = this.state;
    const p5 = this.libs.p5;

    p5.background(255);
    p5.push();
    p5.translate(
      state.athlete.x + state.athlete.width / 2,
      state.athlete.y + state.athlete.height / 2
    );
    p5.rotate(state.athlete.isDown ? 0 : -p5.PI / 4);
    p5.imageMode(p5.CENTER);
    p5.image(
      this.assets["situp.png"],
      0,
      0,
      state.athlete.width,
      state.athlete.height
    );
    p5.pop();

    // Draw counter
    p5.textSize(24);
    p5.textAlign(p5.LEFT);
    p5.fill(0);
    p5.text(
      `Sit-ups: ${state.athlete.sitUpCount}/${state.requiredSitUps}`,
      10,
      30
    );

    if (state.gameOver) {
      p5.textSize(48);
      p5.textAlign(p5.CENTER);
      p5.fill(0, 255, 0); // green
      p5.text(state.message, p5.width / 2, p5.height / 2);
    }
  }

  /** return true if game is won, false if lost */
  end() {
    return this.state.won;
  }
}
