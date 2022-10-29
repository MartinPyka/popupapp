import { GlueStrip } from './gluestrip';
import { ProjectionFold } from './projection.fold';
import * as ptools from 'src/app/utils/projectiontools';
import { PlaneRectangle } from '../model/planes/plane.rectangle';
import { FaceRectangle } from '../model/faces/face.rectangle';
import { Point } from 'paper/dist/paper-core';

/**
 * projection class for a parallel fold
 */
export class ProjectionParallel extends ProjectionFold {
  /**
   * creates the path geometry for the parallel fold
   */
  protected override createProjection() {
    super.createProjection();
    this.createMiddleFoldingLine(this.mechanism.leftSide.width.getValue());
    this.createGlueStripes();
    this.group.position = new Point(0, 30);
  }

  /**
   * create the glue stripes for the parallel fold
   * in order to attach it to the ground of the
   * parent mechanism
   */
  protected createGlueStripes() {
    this.createGlueStripPart(this.mechanism.leftSide.topSide, this.leftTop);
    this.createGlueStripPart(this.mechanism.leftSide.downSide, this.leftDown);
    this.createGlueStripPart(this.mechanism.rightSide.topSide, this.rightTop);
    this.createGlueStripPart(this.mechanism.rightSide.downSide, this.rightDown);
  }

  /**
   * creates a glue strip for a side and adds it to the corresponding
   * group and glue strip list
   * @param side for which a glue strip should be created
   * @param parent parent group of the glue strip
   */
  private createGlueStripPart(side: FaceRectangle, parent: paper.Group) {
    const glueStrip = new GlueStrip(side);
    parent.addChild(glueStrip.path);
    this.glueStripes.push(glueStrip);
  }
}
