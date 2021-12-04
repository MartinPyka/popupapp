import { Injectable } from '@angular/core';
import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BasicRenderService } from '../services/BasicRenderService';

export class Cube {
  readonly position: BehaviorSubject<Vector3>;
  cube: Mesh;
  subscription: Subscription;

  constructor(position: Vector3, brs: BasicRenderService) {
    this.position = new BehaviorSubject<Vector3>(position);
    this.cube = brs.createCube(this.position.value);
    this.cube.actionManager?.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => this.position.next(new Vector3(0, 0, 0)))
    );
    this.subscription = this.position.subscribe((x) => (this.cube.position.x = x.x));
  }

  dispose() {
    this.subscription.unsubscribe();
  }
}
