import { GlueStrip } from './gluestrip';
import { ProjectionFold } from './projection.fold';
import * as ptools from 'src/app/utils/projectiontools';
import { PlaneRectangle } from '../model/planes/plane.rectangle';
import { FaceRectangle } from '../model/faces/face.rectangle';
import { Point } from 'paper/dist/paper-core';
import { ThinSprite } from 'babylonjs/Sprites/thinSprite';
import { MechanismParallel } from '../model/mechanisms/mechanism.parallel';
import { takeUntil } from 'rxjs';

/**
 * projection class for a parallel fold
 */
export class ProjectionParallel extends ProjectionFold {
  protected override mechanism: MechanismParallel;
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
   * embeds the glue hints into a group that applys the transform
   * of the leftTransform to the glue hint
   */
  protected override createGlueHints(): void {
    super.createGlueHints();

    // adds the point to the gluehintpath
    this.mechanism.leftSide
      .projectionGlueHints()
      .getValue()
      .forEach((point) => this.leftGlueHintPath.add(point));

    this.leftGlueHints.position.y = this.mechanism.leftHinge.transform.position.y;
    this.leftGlueHints.position.x = 2;
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

  /**
   * we need to update the glue strips, when the distance changes
   */
  protected override registerEvents(): void {
    super.registerEvents();
    this.mechanism.leftDistanceChanged.pipe(takeUntil(this.mechanism.onDispose)).subscribe(() => {
      this.leftGlueHints.position.y = this.mechanism.leftHinge.transform.position.y;
    });
  }
}
