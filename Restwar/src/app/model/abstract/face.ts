import {
  ActionEvent,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  Nullable,
  Observer,
  PointerEventTypes,
  PointerInfo,
  TransformNode,
  Vector3,
} from 'babylonjs';
import { FaceClick, FaceMove, FaceUp, IClickable, IModelDisposable } from '../interfaces/interfaces';
import { Subject } from 'rxjs';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a face mesh
 * for 3d and 2d.
 */
export abstract class Face extends TransformObject3D implements IClickable {
  public readonly onMouseDown: Subject<FaceClick>;
  public readonly onMouseUp: Subject<FaceUp>;
  public readonly onMouseMove: Subject<FaceMove>;

  // properties necessary for dispose-function
  public mesh: Mesh;
  protected executeActionList: ExecuteCodeAction[];

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.onMouseDown = new Subject<FaceClick>();
    this.onMouseUp = new Subject<FaceUp>();
    this.onMouseMove = new Subject<FaceMove>();
    this.executeActionList = [];
  }

  override dispose() {
    super.dispose();
    this.executeActionList.forEach((executeAction) => {
      if (executeAction) {
        this.mesh.actionManager?.unregisterAction(executeAction);
      }
    });

    if (this.mesh != undefined) {
      this.mesh.dispose();
    }

    this.onMouseDown.complete();
    this.onMouseUp.complete();
    this.onMouseMove.complete();
  }

  setParent(parent: TransformNode) {
    this.mesh.parent = parent;
  }

  override visible(value: boolean): void {
    this.mesh.isVisible = value;
  }

  registerClickEvents() {
    this.mesh.actionManager = new ActionManager(this.mesh.getScene());

    let moveEvent: Nullable<Observer<PointerInfo>>;
    function getMoveEvent(): Nullable<Observer<PointerInfo>> {
      return moveEvent;
    }

    let outPointerInfo: PointerInfo;

    const triggerOnMouseDown = new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => {
      if (!this.isRayFromFront(evt)) {
        return;
      }

      // if there is an old instance of moveEvent, remove it
      if (moveEvent) {
        this.mesh.getScene().onPointerObservable.remove(moveEvent);
      }

      // when mouse down is pressed create a new moveEvent
      moveEvent = this.mesh.getScene().onPointerObservable.add((pointerInfo) => {
        // check for pointer move events
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE && pointerInfo.event.buttons === 1) {
          /** somehow, this is necessary, as the pointermove event gets
           * fired twice, but we only want to propagate it one time
           */
          if (
            outPointerInfo &&
            outPointerInfo.event.offsetX === pointerInfo.event.offsetX &&
            outPointerInfo.event.offsetY === pointerInfo.event.offsetY
          ) {
            return;
          }
          outPointerInfo = pointerInfo;
          this.onMouseMove.next({ face: this, event: pointerInfo });
        }

        // check for pointer up events and delete this event
        if (pointerInfo.type === PointerEventTypes.POINTERUP) {
          const _moveEvent = getMoveEvent();
          if (_moveEvent) {
            _moveEvent.unregisterOnNextCall = true;
          }
          this.onMouseUp.next({ face: this, event: pointerInfo });
        }
      });

      this.mesh.getScene().onPointerUp;
      this.onMouseDown.next({ face: this, event: evt });
    });
    this.executeActionList.push(triggerOnMouseDown);
    this.mesh.actionManager.registerAction(triggerOnMouseDown);
  }

  /**
   * checks, whether the ray came from the front side
   * or the back side of the plane
   *
   * @param evt action event with mouse coordinates
   * @returns true, if ray came from front, else false
   */
  protected isRayFromFront(evt: ActionEvent): boolean {
    const pickInfo = this.mesh.getScene().pick(evt.pointerX, evt.pointerY);
    if (!pickInfo) return false;
    const rayDirection = pickInfo.ray?.direction;
    const normalDirection = pickInfo.getNormal(true);
    if (rayDirection != null && normalDirection != null) {
      if (Vector3.Dot(rayDirection, normalDirection) > 0) {
        return false;
      }
    }
    return true;
  }
}
