import { Path, Group, Point } from 'paper';
import { BehaviorSubject } from 'rxjs';

/**
 * this is a basic projection class with some basic functionality for
 * updating and rendering 2d-projections of mechanisms
 */
export class Projection {
  public readonly seam: BehaviorSubject<boolean>;

  // main group for the projection item
  protected group: paper.Group;

  constructor() {
    this.seam = new BehaviorSubject<boolean>(true);
    this.group = new Group();
    this.group.applyMatrix = false;
  }

  public dispose() {
    this.seam.complete();
    this.group.remove();
  }
}
