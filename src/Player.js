import MapController from './controllers/MapController';
import { Moveable } from './Moveable';

export class Player extends Moveable {
  setPosition(nextCoord, ignoreCollision = false) {
    if (!this.toWorldPosition) return;

    const nextElevation = MapController.instance.getElevationUnderPoint(
      nextCoord.x,
      nextCoord.y
    );

    // Does coord collide with a higher elevation block?
    // If so, don't move the player
    if (ignoreCollision || nextElevation <= this.elevation) {
      console.log('move!');
      this.coord = { ...nextCoord };
      const worldCoord = this.toWorldPosition(this.coord);
      this.sprite.x = worldCoord.x;
      this.sprite.y = worldCoord.y;
      this.elevation = nextElevation;
    }

    this.draw();
  }
}
