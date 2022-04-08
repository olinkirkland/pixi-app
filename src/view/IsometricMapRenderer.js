import { Graphics, Sprite } from 'pixi.js';
import GameController from '../controllers/GameController';
import { colorBetween } from '../Util';

export default class IsometricMapRenderer extends Sprite {
  moveables = [];

  drawMap(blocks) {
    if (this.map) this.removeChild(this.map);

    // Sort blocks by elevation and x and y
    blocks = blocks.sort((a, b) => {
      if (a.z !== b.z) return a.z - b.z;
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    this.map = new Sprite();
    this.map.graphics = new Graphics();
    this.addChild(this.map);

    const scale = 0.2;
    this.tileWidth = Math.floor(232 * scale);
    this.tileHeight = Math.floor(110 * scale);

    blocks.forEach((block) => {
      // if (block.z > 0) return;
      const coord = this.toWorldPosition({ x: block.x, y: block.y });
      let u = new Sprite(
        GameController.instance.app.loader.resources[`tile-${block.t}`].texture
      );

      u.x = coord.x - this.tileWidth / 2;
      u.y = coord.y - this.tileHeight;
      u.scale = { x: scale, y: scale };
      this.map.addChild(u);

      this.map.graphics.beginFill(
        colorBetween(0x0000ff, 0xffffff, block.z / 2)
      );
      this.map.graphics.moveTo(coord.x, coord.y);
      this.map.graphics.drawRect(coord.x, coord.y, 5, 5);
      this.map.graphics.endFill();
    });

    this.map.addChild(this.map.graphics);
  }

  // Convert grid coordinates to iso coordinates
  toIso(Xg, Yg) {
    const Wt = this.tileWidth;
    const Ht = this.tileHeight;
    const Wm = this.map.width;
    const Hm = this.map.height;

    const Xi = (Wt * Yg + Hm * Wt - Xg * Wt) / -2;
    const Yi = ((Hm - Xg - 1) * Ht + Wm * Ht - Yg * Ht) / -2;
    return { x: Xi, y: Yi };
  }

  drawMoveable(moveable) {
    console.log('MapRenderer:drawMoveable', moveable);
    this.moveables.push(moveable);
    moveable.toWorldPosition = this.toWorldPosition.bind(this);
    this.map.addChild(moveable.sprite);
  }

  toWorldPosition(coord, z = 0) {
    const coordIso = this.toIso(coord.x, coord.y);
    return { x: coordIso.x, y: coordIso.y - z * this.tileHeight };
  }

  unload() {
    console.log('unload mapRenderer');
    // this.moveables = [];
  }
}
