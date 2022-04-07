import { Graphics, Sprite } from 'pixi.js';

export class Moveable {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.sprite = new Sprite();
    this.draw();
  }

  draw() {
    // Draw a red circle
    this.sprite.graphics = new Graphics();
    this.sprite.graphics.beginFill(0xff0000);
    this.sprite.graphics.drawCircle(0, 0, 5);
    this.sprite.graphics.endFill();
    this.sprite.addChild(this.sprite.graphics);
  }
}
