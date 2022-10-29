import { BehaviorSubject, takeUntil } from 'rxjs';
import { Path, Group, Point } from 'paper';
import { Observable } from 'babylonjs';
import { ProjectionService } from '../services/projection.service';
import { AppInjector } from '../app.module';
import { FaceRectangle } from '../model/faces/face.rectangle';

/**
 * glue strip path for projections
 */
export class GlueStrip {
  protected side: FaceRectangle;
  protected projectionService: ProjectionService;

  public path: paper.Path;

  constructor(side: FaceRectangle) {
    this.side = side;
    this.projectionService = AppInjector.get(ProjectionService);
    this.createPath();
    this.registerEvents();
  }

  /**
   * creates the geometry of the glue strip
   */
  protected createPath() {
    this.path = new Path({
      strokeColor: 'black',
      fillColor: null,
    });
    this.path.applyMatrix = false;
    this.path.pivot = new Point(0, 0);

    const width = this.projectionService.glueStripWidth.value;
    const offset = this.projectionService.glueStripOffset.value;
    this.path.add(new Point(-this.side.width.value / 2, 0));
    this.path.add(new Point(-this.side.width.value / 2 + offset, width));
    this.path.add(new Point(this.side.width.value / 2 - offset, width));
    this.path.add(new Point(this.side.width.value / 2, 0));
  }

  protected registerEvents() {
    this.side.height.pipe(takeUntil(this.side.onDispose)).subscribe((height) => this.setPosition(height));
  }

  setPosition(height: number) {
    this.path.position = new Point(0, height);
  }
}
