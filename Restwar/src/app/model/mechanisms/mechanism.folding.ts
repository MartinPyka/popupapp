import { BehaviorSubject } from 'rxjs';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { Hinge } from '../hinges/hinge';
import { HingeActive } from '../hinges/hinge.active';
import { IProjectable } from '../interfaces/interfaces';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { FoldForm } from '../types/FoldForm';
import { Mechanism } from './mechanism';

const DEFAULT_WIDTH = 2;
const DEFAULT_HEIGHT = 5;
const DEFAULT_OFFSET = 0;
const DEFAULT_FOLDFORM: FoldForm = { LeftSideSwitch: false, RightSideSwitch: false, TopFoldSwitch: false };

/**
 * generic class for all kinds of folding mechanisms
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
  parentHinge: Hinge;

  /**
   * the hinges this mechanism creates
   */
  leftHinge: HingeActive;
  topHinge: HingeActive;
  rightHinge: HingeActive;

  /**
   * left and right side that represents the geometry of the fold.
   * This can be used for projections but it could also be hidden.
   */
  leftSide: PlaneRectangle;
  rightSide: PlaneRectangle;

  constructor(parent: Hinge) {
    super();

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

    this.parentHinge = parent;

    this.leftHinge = new HingeActive(parent.leftTransform, scene);
    this.rightHinge = new HingeActive(parent.rightTransform, scene);

    /* the top hinge is assigned to the right side of the left hinge */
    this.topHinge = new HingeActive(this.leftHinge.rightTransform, scene);

    this.leftSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.leftHinge.rightTransform);
    this.rightSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.rightHinge.leftTransform);

    this.offset = new BehaviorSubject<number>(DEFAULT_OFFSET);
    this.foldingForm = new BehaviorSubject<FoldForm>(DEFAULT_FOLDFORM);
  }

  override dispose(): void {
    super.dispose();
    this.parentHinge.dispose();
    this.leftHinge.dispose();
    this.topHinge.dispose();
    this.rightHinge.dispose();
    this.leftSide.dispose();
    this.rightSide.dispose();

    this.offset.complete();
    this.foldingForm.complete();
  }

  public projectTopSide(): paper.Item {
    return new paper.Item();
  }

  public projectDownSide(): paper.Item {
    return new paper.Item();
  }
}
