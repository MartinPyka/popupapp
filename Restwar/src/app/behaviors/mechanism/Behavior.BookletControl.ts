import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { Behavior } from '../behavior';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { PlaneRectangle } from 'src/app/model/planes/plane.rectangle';
import { Scene, Vector3 } from '@babylonjs/core';
import { MaterialService } from 'src/app/materials/material-service';
import { Channel } from 'src/app/core/emitter.channels';
import { IDisposable } from '@babylonjs/core';
import { first } from 'rxjs';

const HANDLE_WIDTH = 3;
const HANDLE_HEIGHT = 3;

export class BehaviorBookletControl extends Behavior implements IDisposable {
  // mechanism this behavior is operating on
  protected mechanism: MechanismActive;

  protected leftHandle: PlaneRectangle;
  protected rightHandle: PlaneRectangle;

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
    this.leftHandle = new PlaneRectangle(HANDLE_WIDTH, HANDLE_HEIGHT, scene, this.mechanism.leftSide);
    this.leftHandle.transform.position = new Vector3(
      this.mechanism.width.getValue() / 2 + HANDLE_WIDTH / 2,
      this.mechanism.height.getValue() - HANDLE_HEIGHT,
      0
    );
    this.leftHandle.material = MaterialService.matBookletHandle;

    this.rightHandle = new PlaneRectangle(HANDLE_WIDTH, HANDLE_HEIGHT, scene, this.mechanism.rightSide);
    this.rightHandle.transform.position = new Vector3(
      -this.mechanism.width.getValue() / 2 - HANDLE_WIDTH / 2,
      this.mechanism.height.getValue() - HANDLE_HEIGHT,
      0
    );
    this.rightHandle.material = MaterialService.matBookletHandle;
  }

  private registerEvents(editorService: EditorService) {
    // list on Booklet_Handle-Events
    editorService.onSelectionMode.on(Channel.BOOKLET_HANDLE, (value: boolean) => {});

    this.subscriptionList.push(
      this.leftHandle.onPickDown.subscribe((planeClick) => {
        this.leftAngle = this.mechanism.leftAngle.getValue();
        this.rightAngle = this.mechanism.rightAngle.getValue();
      })
    );
  }

  public override dispose(): void {
    super.dispose();
    this.leftHandle.dispose();
    this.rightHandle.dispose();
  }
}
