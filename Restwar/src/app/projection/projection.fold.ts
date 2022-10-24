import { MechanismFolding } from '../model/mechanisms/mechanism.folding';
import { Projection } from './projection';
import * as ptools from 'src/app/utils/projectiontools';
import { Path, Group, Point } from 'paper';
import { takeUntil } from 'rxjs';

const DEFAULT_DISTANCE = 20;

/**
 * class for all projections that refer to mechanisms,
 * which have two sides and at least one fold (active
 * mechanism, p-fold, v-fold)
 */
export class ProjectionFold extends Projection {
  protected mechanism: MechanismFolding;
  protected pathFoldLine: paper.Path;

  protected glueStripes: paper.Group;

  constructor(mechanism: MechanismFolding) {
    super();
    this.glueStripes = new Group();
    this.mechanism = mechanism;
    this.createProjection();
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
    const leftTop = new Group(ptools.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsTopSideValue()));
    const rightTop = new Group(ptools.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsTopSideValue()));
    this.projectionTop = new Group([leftTop, rightTop, this.foldLines]);
    ptools.makeMatrixInheritable(this.projectionTop);

    const leftDown = new Group(ptools.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsDownSideValue()));
    const rightDown = new Group(
      ptools.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsDownSideValue())
    );
    this.projectionDown = new Group([leftDown, rightDown]);
    ptools.makeMatrixInheritable(this.projectionDown);

    rightTop.rotate(180, new Point(0, 0));
    rightDown.rotate(180, new Point(0, 0));
    this.projectionDown.position = new Point(DEFAULT_DISTANCE, 0);

    this.group.addChildren([this.projectionTop, this.projectionDown, this.glueStripes]);
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
  }

  /**
   * registers all events that are related to the left
   * and right side of the fold
   */
  protected registerSideEvents() {
    this.mechanism.leftSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        ptools.updatePathRectangleOpen(this.projectionTop.children[0].children[0] as paper.Path, points)
      );

    this.mechanism.leftSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        ptools.updatePathRectangleOpen(this.projectionDown.children[0].children[0] as paper.Path, points)
      );

    this.mechanism.rightSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        ptools.updatePathRectangleOpen(this.projectionTop.children[1].children[0] as paper.Path, points)
      );

    this.mechanism.rightSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        ptools.updatePathRectangleOpen(this.projectionDown.children[1].children[0] as paper.Path, points)
      );
  }
}
