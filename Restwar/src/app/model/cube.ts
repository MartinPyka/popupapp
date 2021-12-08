import { Vector3 } from '@babylonjs/core';
import { BasicRenderService } from '../services/BasicRenderService';
import { Object3D } from './abstract/object3d';

export class Cube extends Object3D {
  constructor(position: Vector3, brs: BasicRenderService) {
    let mesh = brs.createCube(position);
    super(position, mesh);
  }
}
