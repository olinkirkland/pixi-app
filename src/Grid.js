import { Graphics, Sprite } from 'pixi.js';
import { colorBetween } from './Util';

export default class Grid extends Sprite {
  size = 4;

  constructor(world) {
    super();
    this.world = world;

    this.spr = new Sprite();
    this.spr.x = 10;
    this.spr.y = 10;
    this.spr.graphics = new Graphics();
    this.spr.addChild(this.spr.graphics);
    this.spr.graphics.lineStyle(1, 0x000000);
    this.spr.graphics.drawRect(
      0,
      0,
      world.map.width * this.size,
      this.world.map.height * this.size
    );
    this.spr.graphics.lineStyle();

    // Shade height map
    this.world.layers.forEach((layer) => {
      // Draw the layer
      const shade = layer.elevation / this.world.layers.length;
      layer.tiles.forEach((tile) => {
        this.spr.graphics.beginFill(colorBetween(0xffffff, 0x000000, shade));
        this.spr.graphics.drawRect(
          tile.x * this.size,
          tile.y * this.size,
          this.size,
          this.size
        );
        this.spr.graphics.endFill();
      });
    });

    this.addChild(this.spr);
  }

  markPlayer(point) {
    if (!this.mark) {
      this.mark = new Sprite();
      // draw a circle
      this.mark.graphics = new Graphics();
      this.mark.addChild(this.mark.graphics);
      this.mark.graphics.lineStyle(3, 0xff0000);
      this.mark.graphics.drawCircle(0, 0, 5);
      this.mark.graphics.lineStyle();
      this.spr.addChild(this.mark);
    }

    this.mark.x = point.x * 4;
    this.mark.y = point.y * 4;

    console.log(point);
  }
}
