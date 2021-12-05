import { PointerDragBehavior, Vector3 } from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { ClosureCommands } from '../core/undo/Command';
import { BasicRenderService } from '../services/BasicRenderService';
import { Object3D } from './abstract/object3d';

export class Sphere extends Object3D {
  subscription: Subscription;

  constructor(position: Vector3, brs: BasicRenderService) {
    super(position);

    this.mesh = brs.createSphere(this.position.value);
    this.mesh.addBehavior(new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) }));
    this.subscriptionlist.push(this.position.subscribe((x) => (this.mesh.position = x)));
  }
}
