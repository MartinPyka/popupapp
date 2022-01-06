import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { Behavior } from '../behavior';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { PlaneRectangle } from 'src/app/model/planes/plane.rectangle';
import { Vector3 } from '@babylonjs/core';
import { MaterialService } from 'src/app/materials/material-service';
import { Channel } from 'src/app/core/emitter.channels';

const HANDLE_WIDTH = 3;
const HANDLE_HEIGHT = 3;

export class BehaviorBookletControl extends Behavior {
  protected override mechanism: MechanismActive;

  protected leftHandle: PlaneRectangle;
  protected rightHandle: PlaneRectangle;

  constructor(mechanism: MechanismActive) {
    super(mechanism);
    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

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

    editorService.onSelectionMode.on(Channel.BOOKLET_HANDLE, (value: boolean) => {});
  }
}
