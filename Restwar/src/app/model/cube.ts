import { Vector3 } from '@babylonjs/core';
import { BasicRenderService } from '../services/BasicRenderService';
import { Object3D } from './abstract/object3d';
import { AppInjector } from 'src/app/app.module';

export class Cube extends Object3D {
  constructor(position: Vector3) {
    const brs = AppInjector.get(BasicRenderService);
    let mesh = brs.createCube(position);
    super(position, mesh);
  }
}
