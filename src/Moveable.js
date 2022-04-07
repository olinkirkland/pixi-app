import { Graphics, Sprite } from 'pixi.js';

export class Moveable {
  constructor() {
    this.coord = { x: 0, y: 0 };
    this.elevation = 0;

    this.sprite = new Sprite();
    this.draw();
  }

  draw() {
    // Draw a red circle
    if (this.sprite.graphics) this.sprite.removeChild(this.sprite.graphics);
    this.sprite.graphics = new Graphics();
    this.sprite.graphics.lineStyle(1, 0x000000);
    this.sprite.graphics.beginFill(0xff0000, this.elevation / 3);
    this.sprite.graphics.drawCircle(0, 0, 5);
    this.sprite.graphics.endFill();
    this.sprite.addChild(this.sprite.graphics);
  }

  // Set position in map coordinates
  setPosition(coord) {
    if (!this.toWorldPosition) return;
    this.coord = { ...coord };
    const worldCoord = this.toWorldPosition(this.coord);
    this.sprite.x = worldCoord.x;
    this.sprite.y = worldCoord.y;
  }

  // Get position in map coordinates
  getPosition() {
    return this.coord;
  }
}
