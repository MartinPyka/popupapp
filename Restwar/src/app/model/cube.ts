import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BasicRenderService } from '../services/BasicRenderService';
import { Object3D } from './abstract/object3d';

export class Cube extends Object3D {
  constructor(position: Vector3, brs: BasicRenderService) {
    super(position);

    this.mesh = brs.createCube(this.position.value);
    this.mesh.actionManager?.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => this.position.next(new Vector3(0, 0, 0)))
    );
    this.subscriptionlist.push(this.position.subscribe((x) => (this.mesh.position.x = x.x)));
  }
}
