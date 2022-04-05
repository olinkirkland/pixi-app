import { generateJoinAction } from './Util';

export default class Client {
  isConnected = false;
  interval;

  constructor(setIsConnected = null, setElapsedTics = null, game = null) {
    this.setIsConnected = setIsConnected;
    this.setElapsedTics = setElapsedTics;
    this.game = game;

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
    let t = { actions: [] };

    if (Math.random() < 1) {
      const u = generateJoinAction();
      t.actions.push(u);
    }

    return t;
  }

  onInterval() {
    this.applyTicObject(this.generateTicObject());
  }

  applyTicObject(u) {
    this.applyActions(u.actions);
    this.setElapsedTics((prev) => prev + 1);
  }

  applyActions(actions) {
    actions.forEach((action) => {
      switch (action.action) {
        case 'join':
          console.log(JSON.stringify(action, null, 2));
          this.game.addMob(action.id, action.value.skin, action.value.name);
          this.game.moveMob(action.id, action.value.x, action.value.y);
          break;
        case 'leave':
          // todo
          break;
        case 'move':
          this.game.moveMob(action.id, action.value.x, action.value.y);
          break;
        case 'skin':
          // todo
          break;
        case 'name':
          // todo
          break;
        default:
          console.error('Unknown action:', action);
      }
    });
  }

  disconnect() {
    this.isConnected = false;
    this.setIsConnected(this.isConnected);
    clearInterval(this.interval);

    this.setElapsedTics(0);
  }
}
