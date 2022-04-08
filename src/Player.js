import MapController from './controllers/MapController';
import { Moveable } from './Moveable';

export class Player extends Moveable {
  falling = true;
  elevationUnderPlayer = 0;
  onMoveFunctions = [];

  setPosition(nextCoord, ignoreCollision = false) {
    if (!this.toWorldPosition) return;

    // Todo remove this
    // this.coord = { ...nextCoord };
    // const worldCoord = this.toWorldPosition(this.coord);
    // this.sprite.x = worldCoord.x;
    // this.sprite.y = worldCoord.y;
    // this.falling = false;
    // return;

    // Todo remove this
    ignoreCollision = true;

    const nextElevation = MapController.instance.getElevationUnderPoint(
      nextCoord.x,
      nextCoord.y
    );

    // Does coord collide with a higher elevation block?
    // If so, don't move the player
    if (ignoreCollision || nextElevation <= this.elevation) {
      this.coord = { ...nextCoord };
      const worldCoord = this.toWorldPosition(this.coord, this.elevation);
      this.sprite.x = worldCoord.x;
      this.sprite.y = worldCoord.y;
      this.elevationUnderPlayer = nextElevation;
      if (this.elevation > this.elevationUnderPlayer) this.falling = true;
      else this.elevation = nextElevation;
    }

    this.onMoveFunctions.forEach((onMoveFunction) => {
      onMoveFunction(this.coord.x, this.coord.y);
    });

    this.draw();
  }

  registerOnMoveFunction(onMoveFunction) {
    this.onMoveFunctions.push(onMoveFunction);
  }

  fall(fallSpeed) {
    console.log('fall', this.elevation, this.elevationUnderPlayer);

    this.elevation -= fallSpeed;
    if (this.elevation <= this.elevationUnderPlayer) {
      this.elevation = this.elevationUnderPlayer;
      this.falling = false;
    }

    this.setPosition(this.coord, this.elevation);

    this.draw();
  }
}
