import { Vector3 } from 'babylonjs';
import { BasicRenderService } from '../services/BasicRenderService';
import { Volume3D } from './abstract/volume3d';
import { AppInjector } from 'src/app/app.module';
import { Subject } from 'rxjs';
import { Click } from './interfaces/interfaces';

export class Sphere extends Volume3D {
  public readonly onMouseDown: Subject<Click>;

  constructor(position: Vector3) {
    const brs = AppInjector.get(BasicRenderService);
    let mesh = brs.createSphere(position);
    super(position, mesh);
  }
}
