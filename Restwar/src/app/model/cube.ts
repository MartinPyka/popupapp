import { Vector3 } from 'babylonjs';
import { BasicRenderService } from '../services/BasicRenderService';
import { AppInjector } from 'src/app/app.module';
import { Volume3D } from './abstract/volume3d';

export class Cube extends Volume3D {
  constructor(position: Vector3) {
    const brs = AppInjector.get(BasicRenderService);
    let mesh = brs.createCube(position);
    super(position, mesh);
  }
}
