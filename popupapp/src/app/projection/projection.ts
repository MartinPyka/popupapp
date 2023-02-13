import { Path, Group, Color } from 'paper';
import { BehaviorSubject } from 'rxjs';
import { AppInjector } from '../app.module';
import { ProjectionService } from '../services/projection.service';
import * as ptools from 'src/app/utils/projectiontools';

/**
 * this is a basic projection class with some basic functionality for
 * updating and rendering 2d-projections of mechanisms
 */
export abstract class Projection {
  public readonly seam: BehaviorSubject<boolean>;

  // main group for the projection item
  protected group: paper.Group;

  // groups for both sides of the mechanism
  protected projectionTop: paper.Group;
  protected projectionDown: paper.Group;

  protected foldLines: paper.Group;

  protected readonly projectionService: ProjectionService;

  constructor() {
    this.projectionService = AppInjector.get(ProjectionService);
    this.seam = new BehaviorSubject<boolean>(true);
    this.group = ptools.getDefaultGroup();

    this.projectionTop = ptools.getDefaultGroup();
    this.projectionDown = ptools.getDefaultGroup();

    this.foldLines = ptools.getDefaultGroup();
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

  /**
   * Returns all paths for glue hints of this projection and
   * subsequent children of the left side
   */
  public abstract projectionGlueHintsLeft(): paper.Group;

  /**
   * Returns all paths for glue hints of this projection and
   * subsequent children of the right side
   */
  public abstract projectionGlueHintsRight(): paper.Group;
}
