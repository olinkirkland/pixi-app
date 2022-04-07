export default class MapController {
  constructor(mapNames) {
    this.mapNames = mapNames;
  }

  load(mapName) {
    let url = `${process.env.PUBLIC_URL}/assets/maps/${mapName}.tmj`;
    console.log('load', mapName, url);
  }
}
