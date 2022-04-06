import { Sprite } from 'pixi.js';

export default class World extends Sprite {
  sortedItems = [];

  // constructor() {
  //   super();
  // }

  loadMap(map) {}

  addLayer(layer) {}

  addSortedChild(u) {
    this.sortedItems.push(u);
    this.addChild(u);
  }
}
