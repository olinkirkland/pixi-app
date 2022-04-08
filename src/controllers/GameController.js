import * as PIXI from 'pixi.js';
import { Player } from '../Player';
import { skins } from '../Util';
import IsometricMapRenderer from '../view/IsometricMapRenderer';
import MapController from './MapController';

export default class GameController {
  static instance;
  mobs = [];
  player = null;

  constructor(setInfo) {
    if (GameController.instance) console.error('GameController is a singleton');
    GameController.instance = this;

    console.log('Initializing game');
    this.setInfo = setInfo;

    // Create PIXI App, attach to DOM
    this.app = new PIXI.Application({ backgroundColor: 0x1099bb });
    document.querySelector('.game-container').appendChild(this.app.view);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // Load tile reference
    let url = `${process.env.PUBLIC_URL}/assets/tile-reference.json`;
    fetch(url).then((response) => {
      response.json().then((json) => {
        this.tileReference = json;
        this.loadTextures();
      });
    });
  }

  loadTextures() {
    // Load Textures, then start the game
    skins.forEach((skin) => {
      this.app.loader.add(skin, `assets/skins/${skin}.png`);
    });

    this.tileReference.forEach((tileReference, index) => {
      this.app.loader.add(`tile-${index}`, `assets/tiles/${tileReference.src}`);
    });

    console.log('Loading textures');
    this.showLoading('Loading textures');

    let url = `${process.env.PUBLIC_URL}/assets/map-reference.json`;
    fetch(url).then((response) => {
      response.json().then((mapNames) => {
        this.app.loader.load(() => {
          let url = `${process.env.PUBLIC_URL}/assets/map-reference.json`;
          fetch(url).then((response) => {
            response.json().then((mapNames) => {
              this.start(mapNames);
            });
          });
        });
      });
    });
  }

  start(mapNames) {
    this.mapRenderer = new IsometricMapRenderer();
    this.mapController = new MapController(mapNames, this.mapRenderer);
    this.app.stage.addChild(this.mapRenderer);

    this.player = new Player();
    this.initializePlayerControls(this.player);
    this.mapController.addPlayer(this.player);
    this.mapController.onComplete = () => {
      this.player.setPosition({ x: 0.5, y: 0.5 }, true); // Todo spawn point
    };

    // Load initial map
    this.mapController.load(mapNames[0]);

    this.hideLoading();
  }

  initializePlayerControls(player) {
    console.log('initializing player controls');
    const MAX_SPEED = 2 / 20; // Maximum speed
    const MIN_SPEED = 0.1 / 20; // Minimum speed before stopping
    const MIN_WALK_SPEED = 0.3 / 20; // Minimum speed to play walk animation
    const FRICTION = 0.8; // Player slows down by this coefficient when not accelerating
    const ACCELERATION = 0.01; // Player accelerates by this coefficient when moving
    const FALL_SPEED = 0.1; // Player falls by this speed

    // Initialize movement values
    let keys = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    this.setInfo((prev) => {
      return { ...prev, keys: keys };
    });

    let speed = 0;
    let acceleration = 0;
    let angle = 0;
    let face = 'right';

    this.app.ticker.add((delta) => {
      if (!this.mapController.map) return;

      const currentAngle = this.angleFromKeys(keys);
      // if (currentAngle !== angle) speed /= 2;
      if (currentAngle !== null) angle = currentAngle;

      acceleration = Object.values(keys).some((key) => key) ? ACCELERATION : 0;

      speed += acceleration;
      speed = Math.min(speed, MAX_SPEED);

      const coord = { ...player.getPosition() };
      coord.x += Math.cos((angle * Math.PI) / 180) * speed;
      coord.y += Math.sin((angle * Math.PI) / 180) * speed;

      if (speed > 0) this.player.setPosition(coord);

      if (!acceleration) speed *= FRICTION;
      if (speed < MIN_SPEED) speed = 0;

      // player.moving = speed > MIN_WALK_SPEED;

      if (angle !== 90 && angle !== 270)
        face = angle > 90 && angle < 270 ? 'left' : 'right';
      // player.face(face);

      if (player.falling) player.fall(FALL_SPEED);

      // if (player.moving)
      //   this.grid.markPlayer(this.world.isoToGrid(player.x, player.y));

      // Ensure player is always in the center of the screen
      this.mapRenderer.x = -player.sprite.x + this.app.renderer.width / 2;
      this.mapRenderer.y = -player.sprite.y + this.app.renderer.height / 2;

      this.setInfo((prev) => {
        return {
          ...prev,
          coord: {
            x: player.getPosition().x.toFixed(2),
            y: player.getPosition().y.toFixed(2),
            z: player.elevation
          },
          motion: {
            angle: angle,
            face: face,
            moving: player.moving,
            speed: speed.toFixed(2),
            acceleration: acceleration.toFixed(1)
          }
        };
      });
    });

    // Key down listener
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

      this.setInfo((prev) => {
        return { ...prev, keys: keys };
      });
    });

    // Key up listener
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

      this.setInfo((prev) => {
        return { ...prev, keys: keys };
      });
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

    // For isometric maps, subtract 45 degrees
    if (angle !== null) angle -= 45;

    return angle;
  }

  showLoading(str) {
    this.setInfo((prev) => {
      return { ...prev, loading: str };
    });
  }

  hideLoading() {
    this.setInfo((prev) => {
      delete prev.loading;
      return { ...prev };
    });
  }

  // jumpToRandomTile() {
  //   this.jumpToTile(Math.floor(Math.random() * this.world.grid.length));
  // }

  // jumpToTile(n) {
  //   const g = this.world.grid[n];
  //   this.player.x = g.x;
  //   this.player.y = g.y;
  //   console.log(JSON.stringify(g));
  // }

  // addMob(id, skin, name, x, y) {
  //   const mob = new Mob(this.app, id, 0, 0, skin, name);
  //   this.world.addSortedChild(mob);
  //   mob.x = x;
  //   mob.y = y;
  //   this.mobs.push(mob);
  // }

  // moveMob(id, x, y) {
  //   const mob = this.mobs.find((mob) => mob.id === id);
  //   if (!mob) {
  //     console.error(`Could not find mob with id: ${id}`);
  //     return;
  //   }

  //   gsap.killTweensOf(mob);
  //   mob.moving = true;
  //   mob.face(x > mob.x ? 'right' : 'left');
  //   gsap.to(mob, {
  //     x: x,
  //     y: y,
  //     duration: 1,
  //     onComplete: () => (mob.moving = false)
  //   });
  // }

  // setSkin(id, skin) {
  //   const mob = this.mobs.find((m) => m.id === id);
  //   if (mob) mob.setSkin(skin);
  //   else {
  //     console.error('Could not find mob with id:', id, ' in ', this.mobs);
  //   }
  // }

  // resetPlayerLocation() {
  //   this.jumpToTile(0);
  // }

  // removeMob(id) {
  //   this.mobs.forEach((mob, index) => {
  //     if (mob.id === id) this.mobs.splice(index, 1);
  //   });
  // }
}
