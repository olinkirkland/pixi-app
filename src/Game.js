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
      this.handlePlayerMovement(this.player, playerSheet);
    });
  }

  handlePlayerMovement(player, playerSheet) {
    // Set the initial position
    player.x = this.app.screen.width / 2;
    player.y = this.app.screen.height / 2;

    // Opt-in to interactivity
    player.interactive = true;

    const MAX_SPEED = 2; // Maximum speed
    const MIN_SPEED = 0.1; // Minimum speed before stopping
    const MIN_WALK_SPEED = 0.3; // Minimum speed to play walk animation
    const FRICTION = 0.8; // Player slows down by this coefficient when not accelerating
    const ACCELERATION = 0.2; // Player accelerates by this coefficient when moving

    // Movement
    let keys = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    let speed = 0;
    let acceleration = 0;
    let angle = null;

    this.app.ticker.add((delta) => {
      // todo change speed if angle is different
      const currentAngle = this.angleFromKeys(keys);
      if (currentAngle != null) angle = currentAngle;

      acceleration = Object.values(keys).some((key) => key) ? ACCELERATION : 0;

      speed += acceleration;
      speed = Math.min(speed, MAX_SPEED);

      player.x += Math.cos((angle * Math.PI) / 180) * speed;
      player.y += Math.sin((angle * Math.PI) / 180) * speed;

      if (!acceleration) speed *= FRICTION;
      if (speed < MIN_SPEED) speed = 0;

      if (speed > MIN_WALK_SPEED) {
        if (player.textures !== playerSheet.walk) {
          player.textures = playerSheet.walk;
          if (!player.playing) player.play();
        }
      } else {
        player.textures = playerSheet.stand;
      }

      if (angle !== 90 && angle !== 270)
        player.scale.x = angle > 90 && angle < 270 ? -1 : 1;

      this.setMovement({
        moving: speed > MIN_WALK_SPEED,
        angle: angle
      });
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

  angleFromKeys(keys) {
    let angle = null;

    if (keys.up && keys.left) {
      angle = 225;
    } else if (keys.up && keys.right) {
      angle = 315;
    } else if (keys.down && keys.left) {
      angle = 135;
    } else if (keys.down && keys.right) {
      angle = 45;
    } else if (keys.up) {
      angle = 270;
    } else if (keys.down) {
      angle = 90;
    } else if (keys.left) {
      angle = 180;
    } else if (keys.right) {
      angle = 0;
    }

    return angle;
  }

  packPlayerSpriteSheet(texture) {
    console.log(texture.width, texture.height);
    const w = texture.width / 4;
    const h = texture.height;

    const playerSheet = {
      stand: [new PIXI.Texture(texture, new PIXI.Rectangle(1 * w, 0, w, h))],
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
