import { takeUntil } from 'rxjs';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { deg2rad } from 'src/app/utils/math';
import { Hinge } from '../hinges/hinge';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { MechanismFolding } from './mechanism.folding';

const DEFAULT_WIDTH = 2;
const DEFAULT_HEIGHT = 5;

/**
 * generic class for all mechanism with three hinges
 */
export abstract class MechanismThreeHinge extends MechanismFolding {
  /**
   * MechanismFolding introduces the center hinge, this one
   * adds two more hinges
   */
  leftHinge: HingeActive;
  rightHinge: HingeActive;

  constructor(parent: Hinge) {
    super(parent);

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

    this.leftHinge = new HingeActive(parent.leftTransform, scene);
    this.rightHinge = new HingeActive(parent.rightTransform, scene);

    /* the center hinge is assigned to the right side of the left hinge */
    this.centerHinge = new HingeActive(this.leftHinge.rightTransform, scene);
    this.centerHinge.transform.rotation.x = deg2rad(180.0);

    this.leftSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.leftHinge.rightTransform, true);
    this.rightSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.rightHinge.leftTransform, true);

    this.registerBasicEvents();
    scene.onBeforeRenderObservable.add(() => {
      this.computeWorldMatrix();
      this.calcFoldPosition();
    });
  }

  override dispose(): void {
    super.dispose();
    this.leftHinge.dispose();
    this.rightHinge.dispose();
  }

  override visible(value: boolean): void {
    super.visible(value);
    this.leftHinge.visible(value);
    this.rightHinge.visible(value);
  }

  /**
   * this is the method that needs to be defined by any inheriting class
   * to define the position of the mechanism elements
   */
  protected abstract calcFoldPosition(): void;

  protected override registerBasicEvents(): void {
    super.registerBasicEvents();
    this.leftHinge.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((hingeClick) => this.onHingeDown.next({ ...hingeClick, mechanism: this }));

    this.rightHinge.onMouseDown
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
  protected override computeWorldMatrix(): void {
    super.computeWorldMatrix();
    this.rightHinge.transform.computeWorldMatrix(true);
    this.leftHinge.transform.computeWorldMatrix(true);
  }
}
