## miCRo - micro game engine for RC

a la Warioware

## Running locally

Pre-reqs: have `node` and `npm` installed

Clone this repo, then:

```sh

# install deps
npm i

# run dev server
npm run dev
```

## Game dev

Games are just directorys with a mandatory `index.js`and `manifest.json`, and an optional `assets/` dir with any images and sounds.

```
 your-game
    assets/
      your-image.png
    index.js
    manifest.json
```

Game are currently served out of `/games` dir.

To just iterate on your own game on a loop, move all the other `/games` to `archived-games`.

Copy the [game template](https://github.com/clairefro/miRCo-engine/tree/main/game-template) `your-game` into `/games` in local development, which has boiler templates.

The `manifest.json` file declares game metadata and registers assets and instructions

IMPORTANT: **name of game must match your game dir name**

```json
{
  "name": "situps",
  "assets": ["situp.png, fart.mp3"],
  "instruction": "Situp !",
  "author": "Your Name"
}
```

### Game examples

- [Situps](https://github.com/clairefro/miRCo-engine/tree/main/games/situps) (image, sound)
- [Dodge Block](https://github.com/clairefro/miRCo-engine/tree/main/games/dodge-block) (image)

### Drawing

The [`p5` library](https://p5js.org/) is available to you on `this.lib.p5`

You can use this to render things to the screen in the `draw()` method

example from [situps](https://github.com/clairefro/miRCo-engine/tree/main/games/situps) game

```js
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
```

### Images

Supported formats: `.png`, `.jpg`

Save your image assets in `/assets` dir inside your game, and declare the filenames in your `manifest.json` assets property

```
situps
    assets/
      situp.png
      fart.mp3
    index.js
    manifest.json
```

manifest.json

```json
{
  "name": "situps",
  "assets": ["situp.png", "fart.mp3"],
  "instruction": "Situp ↑ !",
  "author": "Claire Froelich"
}
```

index.js

```js
p5.image(
  this.assets["situp.png"],
  0,
  0,
  state.athlete.width,
  state.athlete.height
);
```

### Sound

Supported formats: `.mp3`, `.wav`

Save your sounds in an `/assets` dir in your game, in declare the filename(s) in your `manifest.json` assets property.

miRCo uses [Howler js](https://howlerjs.com/) to play sound. You can access sound controls from `this.libs.sounds`

```
situps
    assets/
      situp.png
      fart.mp3
    index.js
    manifest.json
```

manifest.json

```json
{
  "name": "situps",
  "assets": ["situp.png", "fart.mp3"],
  "instruction": "Situp ↑ !",
  "author": "Claire Froelich"
}
```

index.js

```js
// start sound
this.libs.sound.play(this.assets["fart.mp3"]);

// stop sound
this.libs.sound.stop(this.assets["fart.mp3"]);
```

### Inputs

Only 4 game controls are allowed: "left", "right", "up", "down"

The player can control with arrow keys, WASD, or CandyCon gamepad controller.

Currently pressed keys can be accessed from

- `this.input.isPressedLeft()`
- `this.input.isPressedRight()`
- `this.input.isPressedUp()`
- `this.input.isPressedDown()`

```js
update(dt) {
  if (this.input.isPressedLeft()) {
    // move left
    this.state.player.x -= 0.2 * dt;
  }
  if (this.input.isPressedRight()) {
    // move right
    this.state.player.x += 0.2 * dt;
  }
  if (this.input.isPressedUp()) {
    // move up
    this.state.player.y += 0.2 * dt;
  }
  if (this.input.isPressedDown()) {
    // move down
    this.state.player.y -= 0.2 * dt;
  }
}

```

## Submitting games

For now, just make a PR with your game (and other games) in the `/games` dir!

Soon I will move game submission to a separate repo, and fetch all the games on launch.

## Roadmap

- add dev mode for game makers to iterate on their own game without moving games...
- Typescript?
- make console prettier (help wanted)
- game PR based game submission system that autochecks for unique names, validated manifest.json etc
- add "START" and "RESTART" buttons
- add a storyline based on wins/losses?
