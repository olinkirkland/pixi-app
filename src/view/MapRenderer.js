import { Graphics, Sprite } from 'pixi.js';
import { colorBetween } from '../Util';

export default class MapRenderer extends Sprite {
  moveables = [];

  drawMap(blocks) {
    if (this.map) this.removeChild(this.map);

    const size = 20;
    this.map = new Sprite();
    this.map.graphics = new Graphics();
    this.map.addChild(this.map.graphics);
    this.addChild(this.map);
    this.map.x = this.map.y = 10;
    this.map.graphics.lineStyle(1, 0x000000);

    blocks.forEach((block) => {
      const shade = block.z / 5;
      this.map.graphics.beginFill(colorBetween(0xffffff, 0x0000ff, shade));
      this.map.graphics.drawRect(block.x * size, block.y * size, size, size);
      this.map.graphics.endFill();
    });
  }

  drawMoveable(moveable) {
    console.log('MapRenderer:drawMoveable', moveable);
    this.moveables.push(moveable);
    moveable.toWorldPosition = this.toWorldPosition;
    this.map.addChild(moveable.sprite);
  }

  toWorldPosition(coord) {
    return { x: coord.x * 20, y: coord.y * 20 };
  }

  unload() {
    console.log('unload mapRenderer');
    // this.moveables = [];
  }
}
