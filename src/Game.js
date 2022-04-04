import * as PIXI from 'pixi.js';

export default class Game {
  constructor(setSpeed = null, setKeys = null) {
    console.log('== Setting up game ==');

    const app = new PIXI.Application({ backgroundColor: 0x1099bb });
    document.body.appendChild(app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const sprite = PIXI.Sprite.from('assets/bob.png');

    // Set the initial position
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;

    // Opt-in to interactivity
    sprite.interactive = true;

    app.stage.addChild(sprite);

    let movement = {
      keys: {
        left: false,
        right: false,
        up: false,
        down: false
      }
    };

    // Movement listeners
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movement.keys.up = true;
          break;
        case 'ArrowDown':
          movement.keys.down = true;
          break;
        case 'ArrowLeft':
          movement.keys.left = true;
          break;
        case 'ArrowRight':
          movement.keys.right = true;
          break;
        default:
          break;
      }

      console.log(`Keydown: ${e.key}`);
      setKeys(movement);
    });

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movement.keys.up = false;
          break;
        case 'ArrowDown':
          movement.keys.down = false;
          break;
        case 'ArrowLeft':
          movement.keys.left = false;
          break;
        case 'ArrowRight':
          movement.keys.right = false;
          break;
        default:
          break;
      }

      console.log(`Key up: ${e.key}`);
      setKeys(movement);
    });
  }
}
