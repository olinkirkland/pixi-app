import * as PIXI from 'pixi.js';

export default class Game {
  constructor(setMovement = null, setKeys = null) {
    console.log('== Setting up game ==');

    const app = new PIXI.Application({ backgroundColor: 0x1099bb });
    document.body.appendChild(app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const sprite = PIXI.Sprite.from('assets/bob.png');

    // Set the initial position
    sprite.anchor.set(sprite.width / 2, sprite.height / 2);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;

    // Opt-in to interactivity
    sprite.interactive = true;

    // Movement
    let keys = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    let speed = {
      vertical: 0,
      horizontal: 0
    };
    let acceleration = {
      vertical: 0,
      horizontal: 0
    };

    let maxSpeed = 3;
    let minSpeed = 0.1;
    let friction = 0.8;

    // Ticker
    app.ticker.add(function (delta) {
      // Change the acceleration
      if (keys.left) acceleration.horizontal = -1;
      if (keys.right) acceleration.horizontal = 1;
      if ((keys.left && keys.right) || (!keys.left && !keys.right))
        acceleration.horizontal = 0;
      if (keys.up) acceleration.vertical = -1;
      if (keys.down) acceleration.vertical = 1;
      if ((keys.up && keys.down) || (!keys.up && !keys.down))
        acceleration.vertical = 0;

      // Change the speed
      speed.horizontal += acceleration.horizontal;
      speed.vertical += acceleration.vertical;

      // Speed limits
      if (speed.horizontal > maxSpeed) speed.horizontal = maxSpeed;
      if (speed.horizontal < -maxSpeed) speed.horizontal = -maxSpeed;
      if (speed.vertical > maxSpeed) speed.vertical = maxSpeed;
      if (speed.vertical < -maxSpeed) speed.vertical = -maxSpeed;

      // Position changes
      sprite.x += speed.horizontal;
      sprite.y += speed.vertical;

      // Slow down
      speed.horizontal *= friction;
      if (speed.horizontal < minSpeed && speed.horizontal > -minSpeed)
        speed.horizontal = 0;

      speed.vertical *= friction;
      if (speed.vertical < minSpeed && speed.vertical > -minSpeed)
        speed.vertical = 0;

      setMovement({ speed: speed, acceleration: acceleration });
    });

    app.stage.addChild(sprite);

    // Movement listeners
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          keys.up = true;
          break;
        case 'ArrowDown':
          keys.down = true;
          break;
        case 'ArrowLeft':
          keys.left = true;
          break;
        case 'ArrowRight':
          keys.right = true;
          break;
        default:
          break;
      }

      console.log(`Keydown: ${e.key}`);
      setKeys({ ...keys });
    });

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          keys.up = false;
          break;
        case 'ArrowDown':
          keys.down = false;
          break;
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'ArrowRight':
          keys.right = false;
          break;
        default:
          break;
      }

      console.log(`Key up: ${e.key}`);
      setKeys({ ...keys });
    });
  }
}
