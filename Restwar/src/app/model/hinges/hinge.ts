import {
  ActionManager,
  ExecuteCodeAction,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  Action,
  PointerEventTypes,
  PointerInfo,
  Observer,
  Nullable,
} from '@babylonjs/core';
import { Subject, Subscription, throwIfEmpty } from 'rxjs';
import { Channel } from 'src/app/core/channels';
import { MaterialService } from 'src/app/materials/material-service';
import { TransformObject3D } from '../abstract/transform.object3d';
import {
  FaceClick,
  FaceMove,
  FaceUp,
  HingeClick,
  HingeMove,
  HingeUp,
  IClickable,
  IModelDisposable,
} from '../interfaces/interfaces';

// constants
const CYLINDER_HEIGHT = 1;
const CYLINDER_DIAMETER = 0.5;
const CYLINDER_TESSELATION = 8;

/**
 * basic hinge class for all kinds of mechanisms that use
 * hinges
 */
export abstract class Hinge extends TransformObject3D implements IModelDisposable, IClickable {
  public readonly onMouseDown: Subject<HingeClick>;
  public readonly onMouseUp: Subject<HingeUp>;
  public readonly onMouseMove: Subject<HingeMove>;

  public onChange: Subject<void>;

  private _width: number;

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    if (value < 0) {
      return;
    }
    this._width = value;
    this.mesh.scaling.y = value;
  }

  /**
   * Left side of the hinge. Every object is attached to this
   * transform
   */
  readonly leftTransform: TransformObject3D;

  /**
   * Right side of the hinge. Every object is attached to this
   * transform
   */
  readonly rightTransform: TransformObject3D;

  readonly actionList: Action[];

  /**
   * mesh that repesents the hinge
   */
  private _mesh: Mesh;

  public get mesh(): Mesh {
    return this._mesh;
  }

  constructor(parent: TransformObject3D | null, scene: Scene) {
    super(parent);
    this.leftTransform = new TransformObject3D(this);
    this.rightTransform = new TransformObject3D(this);
    this.actionList = [];
    this.onChange = new Subject<void>();

    this.onMouseDown = new Subject<HingeClick>();
    this.onMouseUp = new Subject<HingeUp>();
    this.onMouseMove = new Subject<HingeMove>();

    // the right side is flipped by 180° on the y-axis,
    // so that the z-axis of the faces are within the 0-180
    // degree fold
    this.rightTransform.transform.rotation.y = Math.PI;

    this.createGeometry(scene);
    this.registerEvents();
  }

  override dispose(): void {
    super.dispose();
    this.onChange.complete();
    this.onMouseDown.complete();
    this.onMouseUp.complete();
    this.onMouseMove.complete();
    this.actionList.forEach((action) => this.mesh.actionManager?.unregisterAction(action));
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }
  }

  /**
   * Determines, in which direction on the parent orientation the 0-180° degree fold
   * should be. This method is mostly used for left and right hinges.
   * @param xPositiv 0-180 folding is on the positive part of the x axis
   * @param zPositive 0-180 folding is on the positive part of the z axis
   * @param leftSide true, if this is the left side
   */
  public setTransformOrientation(xPositive: boolean, zPositive: boolean, leftSide: boolean) {
    if (xPositive && zPositive) {
      if (leftSide) {
        this.leftTransform.transform.rotation.y = 0;
        this.rightTransform.transform.rotation.y = Math.PI;
      } else {
        this.leftTransform.transform.rotation.y = Math.PI;
        this.rightTransform.transform.rotation.y = 0;
      }
    }
  }

  /**
   * Creates the geometry
   *
   * @param scene scene for registering the mesh
   */
  protected createGeometry(scene: Scene) {
    this._mesh = MeshBuilder.CreateCylinder(
      'cylinder',
      {
        height: CYLINDER_HEIGHT,
        diameter: CYLINDER_DIAMETER,
        tessellation: CYLINDER_TESSELATION,
      },
      scene
    );

    this.mesh.parent = this.transform;
    // rotate the hinge by 90° into its standard orientation
    this.mesh.rotate(new Vector3(0, 0, 1), Math.PI / 2);
    this.mesh.material = MaterialService.matHingeDefault;
  }

  /**
   * registers all events
   */
  protected registerEvents() {
    this.mesh.actionManager = new ActionManager(this.mesh.getScene());

    this.actionList.push(
      new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt) => {
        this.mesh.material = MaterialService.matHingeMouseOver;
      })
    );
    this.actionList.push(
      new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (evt) => {
        this.mesh.material = MaterialService.matHingeSelectable;
      })
    );

    let moveEvent: Nullable<Observer<PointerInfo>>;
    function getMoveEvent(): Nullable<Observer<PointerInfo>> {
      return moveEvent;
    }

    let outPointerInfo: PointerInfo;

    this.actionList.push(
      new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => {
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
            this.onMouseMove.next({ hinge: this, event: pointerInfo });
          }

          // check for pointer up events and delete this event
          if (pointerInfo.type === PointerEventTypes.POINTERUP) {
            const _moveEvent = getMoveEvent();
            if (_moveEvent) {
              _moveEvent.unregisterOnNextCall = true;
            }
            this.onMouseUp.next({ hinge: this, event: pointerInfo });
          }
        });

        this.mesh.getScene().onPointerUp;
        this.onMouseDown.next({ hinge: this, event: evt });
      })
    );

    this.editorService.registerSelection(Channel.SELECTION_HINGE, (value: boolean) => {
      if (value) {
        this.actionList.forEach((action) => this.mesh.actionManager?.registerAction(action));
        this.mesh.material = MaterialService.matHingeSelectable;
      } else {
        this.actionList.forEach((action) => this.mesh.actionManager?.unregisterAction(action));
        this.mesh.material = MaterialService.matHingeDefault;
      }
    });
  }
}
