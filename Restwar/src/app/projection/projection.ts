import { Path, Group, Color } from 'paper';
import { BehaviorSubject } from 'rxjs';
import { AppInjector } from '../app.module';
import { ProjectionService } from '../services/projection.service';

/**
 * this is a basic projection class with some basic functionality for
 * updating and rendering 2d-projections of mechanisms
 */
export class Projection {
  public readonly seam: BehaviorSubject<boolean>;

  // main group for the projection item
  protected group: paper.Group;

  protected readonly projectionService: ProjectionService;

  constructor() {
    this.projectionService = AppInjector.get(ProjectionService);
    this.seam = new BehaviorSubject<boolean>(true);
    this.group = new Group();
    this.group.applyMatrix = false;
  }

  public dispose() {
    this.seam.complete();
    this.group.remove();
  }

  /**
   * updates the stroke width for the entire projection
   * @param value stroke width
   */
  public updateStrokeWidth(value: number) {
    this.group.strokeWidth = value;
  }

  /**
   * updates the stroke color for the entire projection
   * @param value stroke color
   */
  public updateStrokeColor(value: string) {
    this.group.strokeColor = new Color(value);
  }
}
