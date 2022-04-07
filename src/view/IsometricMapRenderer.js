import { Graphics, Sprite } from 'pixi.js';
import { colorBetween } from '../Util';

export default class IsometricMapRenderer extends Sprite {
  moveables = [];

  drawMap(blocks) {
    if (this.map) this.removeChild(this.map);

    this.map = new Sprite();
    this.map.graphics = new Graphics();
    this.map.addChild(this.map.graphics);
    this.addChild(this.map);
    this.map.x = this.map.y = 10;
    this.map.graphics.lineStyle(1, 0x000000);

    blocks.forEach((block) => {
      const shade = block.z / 3;
      this.map.graphics.beginFill(colorBetween(0xffffff, 0x0000ff, shade));
      const coord = this.toWorldPosition({ x: block.x, y: block.y });
      this.map.graphics.drawRect(coord.x, coord.y, 5, 5);
      this.map.graphics.endFill();
    });
  }

  // Convert grid coordinates to iso coordinates
  toIso(Xg, Yg) {
    const Wt = 25;
    const Ht = 25;
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

  toWorldPosition(coord) {
    const coordIso = this.toIso(coord.x, coord.y);
    return { x: coordIso.x, y: coordIso.y };
  }

  unload() {
    console.log('unload mapRenderer');
    // this.moveables = [];
  }
}
