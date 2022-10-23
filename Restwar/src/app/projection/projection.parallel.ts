import { ProjectionFold } from './projection.fold';

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
