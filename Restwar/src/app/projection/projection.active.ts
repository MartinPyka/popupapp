import { MechanismActive } from '../model/mechanisms/mechanism.active';
import { Path, Group, Point } from 'paper';
import { Projection } from './projection';
import * as projection from 'src/app/utils/projectiontools';
import { takeUntil } from 'rxjs';
import { ProjectionFold } from './projection.fold';

/**
 * projection class for active mechanism
 */
export class ProjectionActive extends ProjectionFold {
  protected override mechanism: MechanismActive;

  /**
   * creates the path geometry for the active fold
   */
  protected override createProjection() {
    this.createMiddleFoldingLine(this.mechanism.width.getValue());
    super.createProjection();
  }

  /**
   * registers events for the change of a projection
   */
  protected override registerEvents() {
    super.registerEvents();
    this.mechanism.width.pipe(takeUntil(this.mechanism.onDispose)).subscribe((value) => {
      this.pathFoldLine.segments[0].point.x = -value / 2;
      this.pathFoldLine.segments[1].point.x = value / 2;
    });
  }
}
