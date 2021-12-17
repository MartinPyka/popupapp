import { Vector3 } from '@babylonjs/core';
import { BasicRenderService } from '../services/BasicRenderService';
import { Volume3D } from './abstract/volume3d';
import { AppInjector } from 'src/app/app.module';

export class Sphere extends Volume3D {
  constructor(position: Vector3) {
    const brs = AppInjector.get(BasicRenderService);
    let mesh = brs.createSphere(position);
    super(position, mesh);
  }
}
