import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { Behavior } from '../behavior';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { PlaneRectangle } from 'src/app/model/planes/plane.rectangle';
import { Angle, DeepImmutableObject, Mesh, MeshBuilder, Scene, Vector2, Vector3 } from '@babylonjs/core';
import { MaterialService } from 'src/app/materials/material-service';
import { Channel } from 'src/app/core/emitter.channels';
import { IDisposable } from '@babylonjs/core';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { snapDegree } from 'src/app/utils/math';
import { takeUntil } from 'rxjs';

const SNAPPING_ANLGE = 5;
const SNAPPING_STEPS = 45;
const HANDLE_WIDTH = 2;
const HANDLE_HEIGHT = 2;
const HITPLANE_WIDTH = 1000;
const HITPLANE_HEIGHT = 1000;

export class BehaviorBookletControl extends Behavior implements IDisposable {
  // mechanism this behavior is operating on
  protected mechanism: MechanismActive;

  protected leftHandle: PlaneRectangle;
  protected rightHandle: PlaneRectangle;

  // this plane is used to determine the difference between the current
  // position of the handle and the target position indicated by the
  // mouse cursor
  protected hitPlane: Mesh;

  // temporary storage of current value for CommandInvoker
  private leftAngle: number = 0;
  private rightAngle: number = 0;

  constructor(mechanism: MechanismActive) {
    super(mechanism);
    this.mechanism = mechanism as MechanismActive;
    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

    this.createGeometry(mechanism, scene);
    this.registerEvents(editorService);
  }

  private createGeometry(mechanism: MechanismActive, scene: Scene): void {
    this.leftHandle = new PlaneRectangle(HANDLE_WIDTH, HANDLE_HEIGHT, scene, this.mechanism.centerHinge.leftTransform);
    this.leftHandle.transform.position = new Vector3(
      this.mechanism.width.getValue() / 2 + HANDLE_WIDTH / 2,
      this.mechanism.height.getValue() - HANDLE_HEIGHT,
      0
    );
    this.leftHandle.material = MaterialService.matBookletHandle;

    this.rightHandle = new PlaneRectangle(
      HANDLE_WIDTH,
      HANDLE_HEIGHT,
      scene,
      this.mechanism.centerHinge.rightTransform
    );
    this.rightHandle.transform.position = new Vector3(
      -this.mechanism.width.getValue() / 2 - HANDLE_WIDTH / 2,
      this.mechanism.height.getValue() - HANDLE_HEIGHT,
      0
    );
    this.rightHandle.material = MaterialService.matBookletHandle;

    this.hitPlane = MeshBuilder.CreatePlane('HitPlane', { width: HITPLANE_WIDTH, height: HITPLANE_HEIGHT }, undefined);
    this.hitPlane.parent = this.mechanism.centerHinge.transform;
    /* the hit plane should be orthogonal to the hinge and at the
    edge of the plane */
    this.hitPlane.rotate(new Vector3(0, 1, 0), -Math.PI / 2);
    this.hitPlane.translate(new Vector3(0, 0, -1), this.mechanism.width.getValue() / 2 + HANDLE_WIDTH / 2);
    this.hitPlane.isVisible = false;
  }

  private registerEvents(editorService: EditorService) {
    // list on Booklet_Handle-Events
    editorService.onSelectionMode.on(Channel.BOOKLET_HANDLE, (value: boolean) => {});

    let i = 0;

    // Left handle, down event
    this.leftHandle.onMouseDown.pipe(takeUntil(this.onDispose)).subscribe((planeClick) => {
      this.leftAngle = this.mechanism.leftAngle.getValue();
    });

    // Left handle, move event
    this.leftHandle.onMouseMove.pipe(takeUntil(this.onDispose)).subscribe((planeMove) => {
      i += 1;
      if (planeMove.event.pickInfo?.ray) {
        const pickingInfo = planeMove.event.pickInfo.ray.intersectsMesh(
          <DeepImmutableObject<Mesh>>(<unknown>this.hitPlane)
        );
        if (!pickingInfo.pickedPoint) {
          return;
        }
        const position = new Vector2(pickingInfo.pickedPoint.y, pickingInfo.pickedPoint.z);
        const angle = Angle.BetweenTwoPoints(new Vector2(0, 0), position);
        const mecDegree = snapDegree(angle.degrees() - 360, SNAPPING_ANLGE, SNAPPING_STEPS);
        this.mechanism.leftAngle.next(mecDegree);
      }
    });
    // Left handle, up event
    this.leftHandle.onMouseUp.pipe(takeUntil(this.onDispose)).subscribe((planeUp) => {
      const doAction = (): CommandParts => {
        const currentPosition = this.mechanism.leftAngle.getValue();
        const previousPosition = this.leftAngle;

        const undo = (): boolean => {
          this.mechanism.leftAngle.next(previousPosition);
          return true;
        };

        const redo = (): boolean => {
          this.mechanism.leftAngle.next(currentPosition);
          return true;
        };

        return new CommandParts(undo, redo, undefined, undefined);
      };
      this.commandInvoker.do(new ClosureCommands(doAction));
    });
    // Right handle, down event
    this.rightHandle.onMouseDown.pipe(takeUntil(this.onDispose)).subscribe((planeClick) => {
      this.rightAngle = this.mechanism.rightAngle.getValue();
    }),
      // Right handle, move event
      this.rightHandle.onMouseMove.pipe(takeUntil(this.onDispose)).subscribe((planeMove) => {
        i += 1;
        if (planeMove.event.pickInfo?.ray) {
          const pickingInfo = planeMove.event.pickInfo.ray.intersectsMesh(
            <DeepImmutableObject<Mesh>>(<unknown>this.hitPlane)
          );
          if (!pickingInfo.pickedPoint) {
            return;
          }
          const position = new Vector2(pickingInfo.pickedPoint.y, pickingInfo.pickedPoint.z);
          const angle = Angle.BetweenTwoPoints(new Vector2(0, 0), position);
          const mecDegree = snapDegree(-angle.degrees(), SNAPPING_ANLGE, SNAPPING_STEPS);
          this.mechanism.rightAngle.next(mecDegree);
        }
      });
    // Right handle, up event
    this.rightHandle.onMouseUp.pipe(takeUntil(this.onDispose)).subscribe((planeUp) => {
      const doAction = (): CommandParts => {
        const currentPosition = this.mechanism.rightAngle.getValue();
        const previousPosition = this.rightAngle;

        const undo = (): boolean => {
          this.mechanism.rightAngle.next(previousPosition);
          return true;
        };

        const redo = (): boolean => {
          this.mechanism.rightAngle.next(currentPosition);
          return true;
        };

        return new CommandParts(undo, redo, undefined, undefined);
      };
      this.commandInvoker.do(new ClosureCommands(doAction));
    });
    // change of width
    this.mechanism.width.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftHandle.transform.position.x = value / 2 + HANDLE_WIDTH / 2;
      this.rightHandle.transform.position.x = -value / 2 - HANDLE_WIDTH / 2;
      this.hitPlane.position.x = value / 2 + HANDLE_WIDTH / 2;
    });
    // change of height
    this.mechanism.height.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftHandle.transform.position.y = value - HANDLE_HEIGHT;
      this.rightHandle.transform.position.y = value - HANDLE_HEIGHT;
    });
  }

  public override dispose(): void {
    super.dispose();
    this.leftHandle.dispose();
    this.rightHandle.dispose();
  }
}
