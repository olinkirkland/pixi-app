import { Box, QuadTree } from 'js-quadtree';
import Block from '../Block';

export default class MapController {
  static instance;
  constructor(mapNames, mapRenderer) {
    if (MapController.instance) console.error('MapController is a singleton');
    MapController.instance = this;
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

    // TODO cull blocks that can't be seen (covered and surrounded by other, non-transparent blocks)

    const allBlocks = this.blocks.query(new Box(0, 0, this.width, this.height));

    // Render the map
    this.mapRenderer.drawMap(allBlocks);
    this.mapRenderer.drawMoveable(this.player);

    // OnComplete callback
    if (this.onComplete) this.onComplete();
  }

  addBlock(x, y, z, t) {
    this.blocks.insert(new Block(x, y, z, t));
  }

  addPlayer(player) {
    this.player = player;
  }

  getBlocksUnderPoint(x, y) {
    const blocksUnderPoint = this.blocks.query(new Box(x - 1, y - 1, 1, 1));
    return blocksUnderPoint;
  }

  getElevationUnderPoint(x, y) {
    const blocksUnderPoint = this.getBlocksUnderPoint(x, y);
    const highestElevation = blocksUnderPoint.reduce((acc, block) => {
      return block.z > acc ? block.z : acc;
    }, 0);

    return highestElevation;
  }

  unload() {
    console.log('unload mapController');
    this.mapRenderer.unload();
  }
}
