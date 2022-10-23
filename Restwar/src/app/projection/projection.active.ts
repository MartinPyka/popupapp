import { MechanismActive } from '../model/mechanisms/mechanism.active';
import { Path, Group, Point } from 'paper';
import { Projection } from './projection';
import * as projection from 'src/app/utils/projection';
import { takeUntil } from 'rxjs';

const DEFAULT_DISTANCE = 20;

/**
 * projection class for active mechanism
 */
export class ProjectionActive extends Projection {
  protected mechanism: MechanismActive;
  protected pathFoldLine: paper.Path;

  constructor(mechanism: MechanismActive) {
    super();
    this.mechanism = mechanism;
    this.createProjection();
    this.registerEvents();

    //this.projectionService.add(this);
  }

  /**
   * creates the path geometry for the active fold
   */
  protected createProjection() {
    this.pathFoldLine = new Path({
      strokeColor: 'black',
    });
    this.pathFoldLine.add(new Point(-this.mechanism.width.getValue() / 2, 0));
    this.pathFoldLine.add(new Point(this.mechanism.width.getValue() / 2, 0));
    this.pathFoldLine.style.dashArray = [2, 2];
    this.foldLines.addChild(this.pathFoldLine);

    const leftTop = new Group(
      projection.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsTopSideValue())
    );
    const rightTop = new Group(
      projection.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsTopSideValue())
    );
    this.projectionTop = new Group([leftTop, rightTop, this.foldLines]);
    projection.makeMatrixInheritable(this.projectionTop);

    const leftDown = new Group(
      projection.createPathRectangleOpen(this.mechanism.leftSide.projectionPointsDownSideValue())
    );
    const rightDown = new Group(
      projection.createPathRectangleOpen(this.mechanism.rightSide.projectionPointsDownSideValue())
    );
    this.projectionDown = new Group([leftDown, rightDown]);
    projection.makeMatrixInheritable(this.projectionDown);

    rightTop.rotate(180, new Point(0, 0));
    rightDown.rotate(180, new Point(0, 0));
    this.projectionDown.position = new Point(DEFAULT_DISTANCE, 0);

    this.group.addChildren([this.projectionTop, this.projectionDown]);
    this.group.position = new Point(150, 80);
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

    this.mechanism.width.pipe(takeUntil(this.mechanism.onDispose)).subscribe((value) => {
      this.pathFoldLine.segments[0].point.x = -value / 2;
      this.pathFoldLine.segments[1].point.x = value / 2;
    });
  }
}
