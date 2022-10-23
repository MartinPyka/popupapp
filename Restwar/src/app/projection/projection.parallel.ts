import { MechanismParallel } from '../model/mechanisms/mechanism.parallel';
import { Projection } from './projection';
import { Path, Group, Point } from 'paper';
import * as projection from 'src/app/utils/projectiontools';
import { takeUntil } from 'rxjs';
import { ProjectionFold } from './projection.fold';
import { MechanismFolding } from '../model/mechanisms/mechanism.folding';

const DEFAULT_DISTANCE = 10;

/**
 * projection class for a parallel fold
 */
export class ProjectionParallel extends ProjectionFold {
  /**
   * creates the path geometry for the parallel fold
   */
  protected override createProjection() {
    this.createMiddleFoldingLine(this.mechanism.leftSide.width.getValue());
    super.createProjection();
  }
}
