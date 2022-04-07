export default class MapController {
  constructor(mapNames) {
    this.mapNames = mapNames;
    this.grid = [];
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

  parse(data) {
    console.log(Object.keys(data));
    this.width = data.width;
    this.height = data.height;
    this.layers = data.layers.map((l) => l.name);
    console.log('parsed');
  }

  unload() {
    console.log('unload');
  }
}
