import { Sprite } from 'pixi.js';

export default class MapRenderer extends Sprite {
  constructor(controller) {
    super();
    this.controller = controller;
  }
}
