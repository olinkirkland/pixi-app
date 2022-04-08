import { Graphics, Sprite } from 'pixi.js';
import GameController from '../controllers/GameController';
import MapController from '../controllers/MapController';

export default class PokeMapRenderer extends Sprite {
  moveables = [];
  blockSprites = {};
  currentlyVisibleBlockSprites = [];

  drawMap(blocks) {
    if (this.map) this.removeChild(this.map);

    this.map = new Sprite();
    this.map.graphics = new Graphics();
    this.map.addChild(this.map.graphics);
    this.addChild(this.map);
    this.map.x = this.map.y = 10;

    blocks.forEach((block) => {
      const coord = this.toWorldPosition({ x: block.x, y: block.y });
      let blockTexture;
      try {
        blockTexture =
          GameController.instance.app.loader.resources[`tile-${block.t}`]
            .texture;
      } catch (error) {}
      let u = new Sprite(blockTexture);
      this.blockSprites[block.x + '.' + block.y] = u;

      u.x = coord.x - 16;
      u.y = coord.y - 16;
      this.map.addChild(u);
      u.visible = false;

      // this.map.graphics.beginFill(0xcccccc);
      // this.map.graphics.drawRect(block.x * 16, block.y * 16, 16, 16);
      // this.map.graphics.endFill();
    });
  }

  addPlayer(player) {
    player.registerOnMoveFunction(this.onMove.bind(this));
  }

  onMove(x, y) {
    console.log('onMove', x, y);
    // Make the currently visible blocks invisible
    this.currentlyVisibleBlockSprites.forEach((spr) => (spr.visible = false));

    // Get blocks around player
    const blocks = MapController.instance.getBlocksAroundPoint(x, y, 10);
    blocks.forEach((block) => {
      const u = this.blockSprites[block.x + '.' + block.y];
      this.currentlyVisibleBlockSprites.push(u);
      if (u) u.visible = true;
    });
  }

  drawMoveable(moveable) {
    console.log('MapRenderer:drawMoveable', moveable);
    this.moveables.push(moveable);
    moveable.toWorldPosition = this.toWorldPosition;
    this.map.addChild(moveable.sprite);
  }

  toWorldPosition(coord) {
    return { x: coord.x * 16, y: coord.y * 16 };
  }

  unload() {
    console.log('unload mapRenderer');
    // this.moveables = [];
    this.blockSprites = {};
  }
}
