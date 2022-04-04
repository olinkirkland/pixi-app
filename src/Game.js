import * as PIXI from 'pixi.js';

export default class Game {
  constructor(setMovement = null, setKeys = null) {
    this.setMovement = setMovement;
    this.setKeys = setKeys;

    console.log('== Setting up game ==');

    this.app = new PIXI.Application({ backgroundColor: 0x1099bb });
    document.body.appendChild(this.app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.app.loader.add('bob', 'assets/bob-walk.png');
    this.app.loader.load(() => {
      // Pack the player sheet
      const playerSheet = this.packPlayerSpriteSheet(
        new PIXI.BaseTexture.from(this.app.loader.resources['bob'].url)
      );

      // Create player
      this.player = new PIXI.AnimatedSprite(playerSheet.walk);
      this.player.anchor.set(0.5);
      this.player.animationSpeed = 0.2;
      this.player.loop = true;
      this.player.play();
      this.handlePlayerMovement(this.player, playerSheet);
    });
  }

  handlePlayerMovement(player, playerSheet) {
    // Set the initial position
    player.x = this.app.screen.width / 2;
    player.y = this.app.screen.height / 2;

    // Opt-in to interactivity
    player.interactive = true;

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
    let minWalkSpeed = 0.3; // Minimum speed to play walk animation
    let friction = 0.8;

    // Ticker
    this.app.ticker.add((delta) => {
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
      player.x += speed.horizontal;
      player.y += speed.vertical;

      // Slow down
      speed.horizontal *= friction;
      if (speed.horizontal < minSpeed && speed.horizontal > -minSpeed)
        speed.horizontal = 0;

      speed.vertical *= friction;
      if (speed.vertical < minSpeed && speed.vertical > -minSpeed)
        speed.vertical = 0;

      if (
        Math.abs(speed.vertical) < minWalkSpeed &&
        Math.abs(speed.horizontal) < minWalkSpeed
      ) {
        player.textures = playerSheet.stand;
      } else {
        if (player.textures !== playerSheet.walk) {
          player.textures = playerSheet.walk;
          player.play();
        }
      }

      player.scale.x = speed.horizontal > 0 ? 1 : -1;

      this.setMovement({ speed: speed, acceleration: acceleration });
    });

    this.app.stage.addChild(player);

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

      // console.log(`Keydown: ${e.key}`);
      this.setKeys({ ...keys });
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

      // console.log(`Key up: ${e.key}`);
      this.setKeys({ ...keys });
    });
  }

  packPlayerSpriteSheet(texture) {
    console.log(texture.width, texture.height);
    const w = texture.width / 4;
    const h = texture.height;

    const playerSheet = {
      stand: [new PIXI.Texture(texture, new PIXI.Rectangle(0 * w, 0, w, h))],
      walk: [
        new PIXI.Texture(texture, new PIXI.Rectangle(0 * w, 0, w, h)),
        new PIXI.Texture(texture, new PIXI.Rectangle(1 * w, 0, w, h)),
        new PIXI.Texture(texture, new PIXI.Rectangle(2 * w, 0, w, h)),
        new PIXI.Texture(texture, new PIXI.Rectangle(3 * w, 0, w, h))
      ]
    };

    return playerSheet;
  }
}
