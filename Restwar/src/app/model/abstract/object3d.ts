import { Mesh, Vector3 } from '@babylonjs/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

export abstract class Object3D {
  // list of subscriptions that need to be unsubscribed on destroy
  readonly subscriptionlist: Subscription[] = [];
  readonly position: BehaviorSubject<Vector3>;
  mesh: Mesh;

  constructor(position: Vector3) {
    this.position = new BehaviorSubject<Vector3>(position);
  }

  /**
   * performs obligatory tasks before the object can be collected
   * by the garbage collection, e.g. unsubscribe all ongoing subscriptions
   */
  dispose() {
    this.subscriptionlist.forEach((subscription) => subscription.unsubscribe());
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }
  }
}
