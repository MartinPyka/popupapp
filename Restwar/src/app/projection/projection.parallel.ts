import { GlueStrip } from './gluestrip';
import { ProjectionFold } from './projection.fold';
import * as ptools from 'src/app/utils/projectiontools';

/**
 * projection class for a parallel fold
 */
export class ProjectionParallel extends ProjectionFold {
  /**
   * creates the path geometry for the parallel fold
   */
  protected override createProjection() {
    this.createMiddleFoldingLine(this.mechanism.leftSide.width.getValue());
    this.createGlueStripes();
    super.createProjection();
  }

  /**
   * create the glue stripes for the parallel fold
   * in order to attach it to the ground of the
   * parent mechanism
   */
  protected createGlueStripes() {
    const gluestripLeft = new GlueStrip(this.mechanism.leftSide);
    this.glueStripes.addChild(gluestripLeft.path);
    ptools.makeMatrixInheritable(this.glueStripes);
  }
}
