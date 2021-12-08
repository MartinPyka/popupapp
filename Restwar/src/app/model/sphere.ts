import { Vector3 } from '@babylonjs/core';
import { BasicRenderService } from '../services/BasicRenderService';
import { Object3D } from './abstract/object3d';

export class Sphere extends Object3D {
  constructor(position: Vector3, brs: BasicRenderService) {
    let mesh = brs.createSphere(position);
    super(position, mesh);
  }
}
