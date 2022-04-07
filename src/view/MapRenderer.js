import { Graphics, Sprite } from 'pixi.js';
import { colorBetween } from '../Util';

export default class MapRenderer extends Sprite {
  moveables = [];

  drawMap(blocks) {
    if (this.spr) this.removeChild(this.spr);

    const size = 20;
    this.spr = new Sprite();
    this.spr.graphics = new Graphics();
    this.spr.addChild(this.spr.graphics);
    this.addChild(this.spr);
    this.spr.x = this.spr.y = 10;
    this.spr.graphics.lineStyle(1, 0x000000);

    blocks.forEach((block) => {
      const shade = block.z / 5;
      this.spr.graphics.beginFill(colorBetween(0xffffff, 0x0000ff, shade));
      this.spr.graphics.drawRect(block.x * size, block.y * size, size, size);
      this.spr.graphics.endFill();
    });
  }

  drawMoveable(moveable) {
    this.moveables.push(moveable);
    moveable.positionFunction = this.toWorldPosition;
    this.spr.addChild(moveable.sprite);
  }

  toWorldPosition(coord) {
    coord.x *= 20;
    coord.y *= 20;
    return coord;
  }
}
