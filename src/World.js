import { Sprite } from 'pixi.js';

export default class World extends Sprite {
  app;
  sortedItems = [];
  tileReference;
  layers = [];
  grid = [];

  tileWidth;
  tileHeight;

  constructor(app) {
    super();
    this.app = app;
  }

  loadMap(map, tileReference) {
    this.tileReference = tileReference;
    this.map = map;
    console.log('Building world');
    map.layers.forEach((layer, i) => this.addLayer(layer, i));
  }

  // Convert iso coordinates to grid coordinates
  isoToGrid(Xi, Yi) {
    const Wt = this.tileWidth;
    const Ht = this.tileHeight;
    const Wm = this.map.width;
    const Hm = this.map.height;

    const X = ((2 * Xi) / Wt + (2 * Yi) / Ht + 1 + Wm) / 2;
    const Y = ((2 * Yi) / Ht - (2 * Xi) / Wt - 1 + Wm + 2 * Hm) / 2;

    return { x: X, y: Y };
  }

  // Convert grid coordinates to iso coordinates
  gridToIso(Xg, Yg) {
    const Wt = this.tileWidth;
    const Ht = this.tileHeight;
    const Wm = this.map.width;
    const Hm = this.map.height;

    const Xi = (Wt * Yg + Hm * Wt - Xg * Wt) / -2;
    const Yi = ((Hm - Xg - 1) * Ht + Wm * Ht - Yg * Ht) / -2;
    return { x: Xi, y: Yi };
  }

  addLayer(l, i) {
    // console.log(`Add Layer: ${layer.name} (${i})`);

    const scale = 0.2;
    this.tileWidth = this.map.tilewidth * scale;
    this.tileHeight = this.map.tileheight * scale;
    let layer = { elevation: i, tiles: [] };

    this.layers.push(layer);
    l.data.forEach((id, index) => {
      id = Math.floor(id - 1);
      if (id < 0 || id >= this.tileReference.length) return;

      const col = index % this.map.width;
      const row = Math.floor(index / this.map.width);

      // Create tile object for layer
      let tile = { ref: this.tileReference[id], x: col, y: row };
      layer.tiles.push(tile);

      let u = new Sprite(this.app.loader.resources[tile.ref.src].texture);
      u.scale = { x: scale, y: scale };

      // Regular
      // u.x = col * w;
      // u.y = row * h;

      // Isometric tiles
      const iso = this.gridToIso(col, row);
      u.x = iso.x;
      u.y = iso.y;

      this.grid.push({ x: u.x, y: u.y });
      this.addSortedChild(u);
    });
  }

  addSortedChild(u) {
    this.sortedItems.push(u);
    this.addChild(u);
  }
}
