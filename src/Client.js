import { randomUserName } from './Util';

export default class Client {
  isConnected = false;
  interval;

  constructor(setIsConnected = null, setMobs = null, setElapsedTics = null) {
    this.setIsConnected = setIsConnected;
    this.setMobs = setMobs;
    this.setElapsedTics = setElapsedTics;

    // Automatically connect
    // this.connect();
  }

  connect() {
    this.isConnected = true;
    this.setIsConnected(this.isConnected);
    clearInterval(this.interval);
    this.interval = setInterval(this.onInterval.bind(this), 1 * 1000);

    this.setElapsedTics(0);
  }

  generateTicObject() {
    let u = { actions: [], coordinates: [] };

    if (Math.random() < 1) {
      // Add a new mob
      const mob = {
        id: Math.floor(Math.random() * 9999),
        action: 'join',
        value: { skin: '', name: randomUserName() }
      };

      console.log(JSON.stringify(mob));
    }

    return u;
  }

  onInterval() {
    this.applyTicObject(this.generateTicObject());
  }

  applyTicObject(u) {
    const actions = u.actions;
    const coordinates = u.coordinates;
    console.log(actions, coordinates);

    this.setElapsedTics((prev) => prev + 1);
  }

  disconnect() {
    this.isConnected = false;
    this.setIsConnected(this.isConnected);
    clearInterval(this.interval);

    this.setElapsedTics(0);
  }
}
