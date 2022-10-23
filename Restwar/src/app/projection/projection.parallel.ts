import { MechanismParallel } from '../model/mechanisms/mechanism.parallel';
import { Projection } from './projection';
import { Path, Group, Point } from 'paper';
import * as projection from 'src/app/utils/projection';
import { takeUntil } from 'rxjs';

const DEFAULT_DISTANCE = 10;

/**
 * projection class for a parallel fold
 */
export class ProjectionParallel extends Projection {
  protected mechanism: MechanismParallel;

  protected pathFoldLine: paper.Path;
  protected projectionTop: paper.Group;
  protected projectionDown: paper.Group;

  constructor(mechanism: MechanismParallel) {
    super();
    this.mechanism = mechanism;
    this.createProjection();
    this.registerEvents();

    this.projectionService.add(this);
  }

  /**
   * creates the path geometry for the parallel fold
   */
  protected createProjection() {
    this.pathFoldLine = new Path({
      strokeColor: 'red',
    });
    this.pathFoldLine.add(new Point(-this.mechanism.leftSide.width.getValue() / 2, 0));
    this.pathFoldLine.add(new Point(this.mechanism.leftSide.width.getValue() / 2, 0));
    //this.pathFoldLine.style.dashArray = [2, 2];

    const leftTop = new Group(
      projection.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsTopSideValue())
    );
    const rightTop = new Group(
      projection.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsTopSideValue())
    );
    this.projectionTop = new Group([leftTop, rightTop, this.pathFoldLine]);
    projection.makeMatrixInheritable(this.projectionTop);

    const leftDown = new Group(
      projection.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsDownSideValue())
    );
    const rightDown = new Group(
      projection.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsDownSideValue())
    );
    this.projectionDown = new Group([leftDown, rightDown]);
    projection.makeMatrixInheritable(this.projectionDown);

    // some manual adjustments
    rightTop.rotate(180, new Point(0, 0));
    rightDown.rotate(180, new Point(0, 0));
    this.projectionDown.position = new Point(DEFAULT_DISTANCE, 0);

    this.group.addChildren([this.projectionTop, this.projectionDown]);
    this.group.position = new Point(150, 40);
    this.group.rotate(90);
  }

  /**
   * registers events for the change of a projection
   */
  protected registerEvents() {
    this.mechanism.leftSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionTop.children[0].children[0] as paper.Path, points)
      );

    this.mechanism.leftSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionDown.children[0].children[0] as paper.Path, points)
      );

    this.mechanism.rightSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionTop.children[1].children[0] as paper.Path, points)
      );

    this.mechanism.rightSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.mechanism.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionDown.children[1].children[0] as paper.Path, points)
      );
  }
}
