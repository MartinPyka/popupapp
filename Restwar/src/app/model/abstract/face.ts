import { Mesh } from '@babylonjs/core';
import { Object3D } from './object3d';
import { IModelDisposable } from '../interfaces/interfaces';
import { Subscription } from 'rxjs';

/**
 * Abstract class for all objects, that represent a face mesh
 * for 3d and 2d.
 */
export abstract class Face extends Object3D implements IModelDisposable {
  mesh: Mesh;
  readonly subscriptionList: Subscription[];

  constructor() {
    super();
    this.subscriptionList = [];
  }

  dispose() {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }
  }
}
