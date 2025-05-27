## miRCo - micro game engine for RC

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>

a cheap knock-off Warioware accepting Recurse Center community contributed microgames

https://mirco.rcdis.co

<img width="660" alt="image" src="https://github.com/user-attachments/assets/65f8e99b-2941-4104-8f75-68607dc215cc" />

Engine built by [clairefro](https://github.com/clairefro) (SP2'25), [jackrr](https://github.com/jackrr) (SP2'25), [rippy](https://github.com/rippy) (mini-6'19), [cysabi](https://github.com/cysabi) (SP2'25) during NGW'25

## Running locally

Pre-reqs: have `node` and `npm` installed

Clone this repo, then:

If you are working on the Game Manager (Engine) itself, `npm run dev`

```sh
# install deps
npm i

# run dev server
npm run dev
```

If you are working on the Game Manager (Engine) itself, `npm run dev`

```sh
# install deps
npm i

# run game-dev server (only plays your game, suppresses splash screen)
npm run game-dev --game=your-game`
```

## Game dev

Games are just directories with a mandatory `index.js`and `manifest.json`, and an optional `assets/` dir with any images and sounds.

```
 your-game
    assets/
      your-image.png
    index.js
    manifest.json
```

To add a game, fork this repo and add your game in `/games` dir, then make a PR. (tip: Use the [game template](https://github.com/clairefro/miRCo-engine/tree/main/game-template) and copy the `your-game` boiler into `/games` to get quick-started.)

Run a game-dev server with `npm run game-dev --game=your-game` to iterate on your game only and bypass the start splash screen.

The `manifest.json` file declares game metadata and registers assets and instructions

IMPORTANT: **name of game must match your game dir name**

```json
{
  "name": "situps",
  "assets": ["situp.png, fart.mp3"],
  "instruction": "Situp !",
  "author": "Your Name",
  "authorLink": "https://your-site-or-rc-directory-page.com (optional)"
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
### Using WebGL (3D) drawing 

The engine now supports the creation of 3D games!

Here are som useful [p5 docs](https://p5js.org/reference/#3D%20Primitives)

As well as a [really nice intro to working with 3D and p5](https://www.youtube.com/watch?v=nqiKWXUX-o8&list=PLRqwX-V7Uu6bPhi8sS1hHJ77n3zRO9FR_)

To enable your games to make use of 3D rendering include the following key within your manifest.json

`is3D : true`

else it will default to 2D.

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
  "author": "Claire Froelich",
  "authorLink": "https://www.recurse.com/directory/6727-claire-froelich"
}
```

index.js

```js
p5.image(
  this.assets['situp.png'],
  0,
  0,
  state.athlete.width,
  state.athlete.height
)
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
  "author": "Claire Froelich",
  "authorLink": "https://www.recurse.com/directory/6727-claire-froelich"
}
```

index.js

```js
// start sound
this.libs.sound.play(this.assets['fart.mp3'])

// stop sound
this.libs.sound.stop(this.assets['fart.mp3'])
```

### Sound volume

You can optionally specify a volume for your with the following syntax.

```js
{
  "name": "launch",
  "assets": [
    { "file": "whirring.wav", "volume": 1.2 },
    { "file": "cheers.wav", "volume": 1.3 },
    "penelope.png"
  ],
  "instruction": "Fly!",
  "author": "Jack Ratner",
  "authorLink": "https://www.recurse.com/directory/6651-jack-ratner"
}
```

### Inputs

Only 4 game controls are allowed: "left", "right", "up", "down"

The player can control with arrow keys, WASD, or CandyCon gamepad controller.

| State         | Description                                            | Left                           | Right                           | Up                           | Down                           |
| ------------- | ------------------------------------------------------ | ------------------------------ | ------------------------------- | ---------------------------- | ------------------------------ |
| Just Pressed  | Returns `true` only on the first frame when pressed    | `this.input.justPressedLeft()` | `this.input.justPressedRight()` | `this.input.justPressedUp()` | `this.input.justPressedDown()` |
| Being Held    | Returns `true` for entire duration button is held down | `this.input.isPressedLeft()`   | `this.input.isPressedRight()`   | `this.input.isPressedUp()`   | `this.input.isPressedDown()`   |
| Just Released | Returns `true` only on the first frame when released   | `this.input.releasedLeft()`    | `this.input.releasedRight()`    | `this.input.releasedUp()`    | `this.input.releasedDown()`    |

```js
update(dt) {
  if (this.input.isPressedLeft()) {
    // move left while left is held
    this.state.player.x -= 0.2 * dt;
  }
  if (this.input.isPressedRight()) {
    // move right while right is held
    this.state.player.x += 0.2 * dt;
  }
  if (this.input.isPressedUp()) {
   // move up while up is held
    this.state.player.y += 0.2 * dt;
  }
  if (this.input.isPressedDown()) {
    // move down while down is held
    this.state.player.y -= 0.2 * dt;
  }
}

```

or...

```js
update(dt) {
  // Check if button was just pressed this frame
  if (this.input.justPressedUp()) {
    this.jump();
  }

  // Check if button is being held
  if (this.input.isPressedRight()) {
    this.moveRight(dt);
  }

  // Check if button was just released
  if (this.input.releasedDown()) {
    this.stopCrouching();
  }
}
```

### Haptic feedback

You can trigger gamepads to vibrate. If no gamepad is plugged in, nothing will happen.

`this.input.gamepad.pulse()`

## Increasing difficulty

MircoEngine keeps track of which "Round" the user is on based on the number of completed games, starting with Round 0. You have access to the `round` value in your game, and can use it for logic that increases the difficulty of the game as rounds increase.

`this.mirco.round`

See examples of `round`-based difficulty logic in [situps](https://github.com/clairefro/miRCo-engine/blob/main/games/situps/index.js)

## Submitting games

For now, just make a PR with your game (and other games) in the `/games` dir! Please fork this repo if you want to contribute a game so you can make a PR.

Someday the game submission may move to a separate repo, and fetch all the games would be fetched on launch.

## Roadmap

- Typescript?
- make console prettier (help wanted)
- game PR based game submission system that autochecks for unique names, validated manifest.json etc
- add a storyline based on wins/losses?

## Deployment (for Claire :P )

`disco deploy --project mirco`
