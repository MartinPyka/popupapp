import { BehaviorSubject, takeUntil } from 'rxjs';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { deg2rad } from 'src/app/utils/math';
import { TransformObject3D } from '../abstract/transform.object3d';
import { Hinge } from '../hinges/hinge';
import { HingeActive } from '../hinges/hinge.active';
import { IProjectable } from '../interfaces/interfaces';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { FoldForm } from '../types/FoldForm';
import { Mechanism } from './mechanism';

const DEFAULT_OFFSET = 0;
const DEFAULT_FOLDFORM: FoldForm = { LeftSideSwitch: false, RightSideSwitch: false, TopFoldSwitch: false };

/**
 * generic class for all kinds of two-side folding mechanisms
 */
export abstract class MechanismFolding extends Mechanism implements IProjectable {
  // generic model parameters

  /**
   * offset on the hinge axis
   */
  public readonly offset: BehaviorSubject<number>;

  /**
   * folding form that determines on which side of the
   * parent hinge this mechanism should sit
   */
  public readonly foldingForm: BehaviorSubject<FoldForm>;

  /**
   * hinge to which this mechanism is attached to
   */
  parentHinge: Hinge | TransformObject3D;

  /**
   * the hinges this mechanism creates
   */
  centerHinge: HingeActive;

  /**
   * left and right side that represents the geometry of the fold.
   * This can be used for projections but it could also be hidden.
   */
  leftSide: PlaneRectangle;
  rightSide: PlaneRectangle;

  constructor(parent: Hinge | TransformObject3D | null) {
    super();

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

    if (parent) {
      this.parentHinge = parent;
    }

    this.offset = new BehaviorSubject<number>(DEFAULT_OFFSET);
    this.foldingForm = new BehaviorSubject<FoldForm>(DEFAULT_FOLDFORM);
  }

  override dispose(): void {
    super.dispose();
    this.parentHinge.dispose();
    this.centerHinge.dispose();
    this.leftSide.dispose();
    this.rightSide.dispose();

    this.offset.complete();
    this.foldingForm.complete();
  }

  override visible(value: boolean): void {
    this.leftSide.visible(value);
    this.rightSide.visible(value);

    this.centerHinge.visible(value);
    super.visible(value);
  }

  public projectTopSide(): paper.Item {
    return new paper.Item();
  }

  public projectDownSide(): paper.Item {
    return new paper.Item();
  }

  protected registerBasicEvents(): void {
    this.leftSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((planeClick) => this.onFaceDown.next({ ...planeClick, mechanism: this }));

    this.rightSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((planeClick) => this.onFaceDown.next({ ...planeClick, mechanism: this }));

    this.centerHinge.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((hingeClick) => this.onHingeDown.next({ ...hingeClick, mechanism: this }));
  }

  /**
   * it is important to manually force the recomputation of the
   * world matrix as it gets otherwise updated only after a frame
   * has been rendered. This causes rendering issues when a property
   * of the mechanism changes and its rendering depends on new
   * absolute positions
   */
  protected computeWorldMatrix(): void {
    // forces to recompute the absolute position
    this.centerHinge.transform.computeWorldMatrix(true);
  }
}
