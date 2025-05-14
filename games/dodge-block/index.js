export default class MircoGame {
  constructor({ input, assets, libs }) {
    this.input = input;
    this.assets = assets;
    this.libs = libs;
    this.state = {
      gameOver: false,
      won: true,
    };
  }

  init(canvas) {
    const customState = {
      player: {
        x: 100,
        y: 220,
        width: 40,
        height: 40,
      },
      block: {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 100,
        height: 70,
        speed: 0.2,
      },
      startTime: performance.now(),

      message: "",
    };

    this.state = { ...this.state, ...customState };
    return;
  }

  update(dt) {
    const s = this.state;
    if (s.gameOver) return;

    // Move player
    if (this.input.isPressedLeft()) s.player.x -= 0.2 * dt;
    if (this.input.isPressedRight()) s.player.x += 0.2 * dt;

    // Clamp player position using p5 width
    s.player.x = Math.max(0, Math.min(800 - s.player.width, s.player.x));

    // Move block
    s.block.y += s.block.speed * dt;

    // Collision detection
    if (this.collides(s.player, s.block)) {
      s.gameOver = true;
      s.message = "Oh no!";
      s.won = false;
    }
    // Win condition
    if (performance.now() - s.startTime > 5000) {
      s.gameOver = true;
      s.message = "Winner!";
      s.won = true;
    }

    // IMPORTANT: call this method at the end of update()
    this.draw();
  }

  draw() {
    const s = this.state;
    const p5 = this.libs.p5;

    p5.background(255);

    // Draw player
    p5.image(
      this.assets["player.png"],
      s.player.x,
      s.player.y,
      s.player.width,
      s.player.height
    );

    // Draw block
    p5.image(
      this.assets["block.png"],
      s.block.x,
      s.block.y,
      s.block.width,
      s.block.height
    );

    // Draw game over message
    if (s.gameOver) {
      p5.textSize(48);
      p5.textAlign(p5.CENTER);
      p5.fill(s.message.includes("Winner") ? [0, 255, 0] : [255, 0, 0]);
      p5.text(s.message, p5.width / 2, p5.height / 2);
    }
  }

  collides(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  end() {
    return this.state.won;
  }
}
