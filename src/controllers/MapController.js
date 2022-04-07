import Block from '../Block';
import { QuadTree, Box } from 'js-quadtree';

export default class MapController {
  constructor(mapNames, mapRenderer) {
    this.mapNames = mapNames;
    this.mapRenderer = mapRenderer;
  }

  load(mapName) {
    if (this.map === mapName) return;
    if (this.map) this.unload();

    let url = `${process.env.PUBLIC_URL}/assets/maps/${mapName}`;
    console.log('load', mapName, url);

    fetch(url).then((response) => {
      response.json().then((json) => {
        this.map = mapName;
        this.parse(json);
      });
    });
  }

  parse(json) {
    // Heights
    this.width = json.width;
    this.height = json.height;

    // Create Blocks from tile data
    this.blocks = new QuadTree(new Box(0, 0, this.width, this.height));
    json.layers.forEach((l, elevation) => {
      l.data.forEach((t, i) => {
        if (!t) return;
        const x = i % this.width;
        const y = Math.floor(i / this.width);
        this.addBlock(x, y, elevation, t);
      });
    });

    // TODO cull blocks that are covered and surrounded by other blocks

    // Render
    const allBlocks = this.blocks.query(new Box(0, 0, this.width, this.height));
    this.mapRenderer.drawMap(allBlocks);
  }

  addBlock(x, y, z, t) {
    console.log('addBlock', t);
    this.blocks.insert(new Block(x, y, z, t));
  }

  addPlayer(player) {
    this.player = player;
    this.mapRenderer.addMoveable(player);
  }

  unload() {
    console.log('unload');
  }
}
