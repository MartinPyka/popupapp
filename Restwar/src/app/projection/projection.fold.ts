import { MechanismFolding } from '../model/mechanisms/mechanism.folding';
import { Projection } from './projection';
import * as ptools from 'src/app/utils/projectiontools';
import { Path, Group, Point } from 'paper';
import { takeUntil } from 'rxjs';
import { GlueStrip } from './gluestrip';
import { Color } from 'paper/dist/paper-core';

const DEFAULT_DISTANCE = 20;

/**
 * class for all projections that refer to mechanisms,
 * which have two sides and at least one fold (active
 * mechanism, p-fold, v-fold)
 */
export class ProjectionFold extends Projection {
  protected mechanism: MechanismFolding;
  protected pathFoldLine: paper.Path;
  protected leftGlueHintPath: paper.Path;
  protected rightGlueHintPath: paper.Path;

  protected glueStripes: GlueStrip[];

  protected leftTop: paper.Group;
  protected rightTop: paper.Group;
  protected leftDown: paper.Group;
  protected rightDown: paper.Group;

  protected leftGlueHints: paper.Group;
  protected rightGlueHints: paper.Group;

  constructor(mechanism: MechanismFolding) {
    super();
    this.mechanism = mechanism;

    this.glueStripes = [];

    this.leftTop = ptools.getDefaultGroup();
    this.rightTop = ptools.getDefaultGroup();
    this.leftDown = ptools.getDefaultGroup();
    this.rightDown = ptools.getDefaultGroup();

    this.leftGlueHints = ptools.getDefaultGroup();
    this.rightGlueHints = ptools.getDefaultGroup();

    this.createProjection();
    this.createGlueHints();
    this.registerEvents();

    this.projectionService.add(this);
  }

  protected createProjection() {
    this.createProjectionOfSides();
  }

  protected registerEvents() {
    this.registerSideEvents();
  }

  /**
   * creates the projections of the left and right side
   */
  protected createProjectionOfSides() {
    this.leftTop.addChild(ptools.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsTopSideValue()));
    this.rightTop.addChild(ptools.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsTopSideValue()));
    this.projectionTop = new Group([this.leftTop, this.rightTop]);
    ptools.makeMatrixInheritable(this.projectionTop);

    this.leftDown.addChild(ptools.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsDownSideValue()));
    this.rightDown.addChild(ptools.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsDownSideValue()));
    this.projectionDown = new Group([this.leftDown, this.rightDown]);
    ptools.makeMatrixInheritable(this.projectionDown);

    this.rightTop.rotate(180, new Point(0, 0));
    this.rightDown.rotate(180, new Point(0, 0));
    this.projectionDown.position = new Point(DEFAULT_DISTANCE, 0);

    this.group.addChildren([this.projectionTop, this.projectionDown]);
    //this.group.position = new Point(150, 80);
    this.group.rotate(90);
  }

  /**
   * create dashed folding line in the middle of the fold
   * @width width of the foldling line
   */
  protected createMiddleFoldingLine(width: number): void {
    this.pathFoldLine = new Path({
      strokeColor: 'black',
    });
    this.pathFoldLine.add(new Point(-width / 2, 0));
    this.pathFoldLine.add(new Point(width / 2, 0));
    this.pathFoldLine.style.dashArray = [2, 2];
    this.foldLines.addChild(this.pathFoldLine);
    this.group.addChild(this.foldLines);
  }

  /**
   * embeds the glue hints into a group that applys the transform
   * of the leftTransform to the glue hint
   */
  protected createGlueHints() {
    this.leftGlueHintPath = new Path();
    this.leftGlueHintPath.strokeColor = new Color(1.0, 0, 0.0);
    //this.leftGlueHintPath.style.dashArray = [2, 2];
    this.leftGlueHints.addChild(this.leftGlueHintPath);
  }

  /**
   * registers all events that are related to the left
   * and right side of the fold
   */
  protected registerSideEvents() {
    this.mechanism.leftSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) => ptools.updatePathRectangleOpen(this.leftTop.children[0] as paper.Path, points));

    this.mechanism.leftSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) => ptools.updatePathRectangleOpen(this.leftDown.children[0] as paper.Path, points));

    this.mechanism.rightSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) => ptools.updatePathRectangleOpen(this.rightTop.children[0] as paper.Path, points));

    this.mechanism.rightSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) => ptools.updatePathRectangleOpen(this.rightDown.children[0] as paper.Path, points));
  }
}
