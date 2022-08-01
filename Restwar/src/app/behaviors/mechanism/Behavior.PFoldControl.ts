import { IDisposable, Scene, SceneLoader } from '@babylonjs/core';
import { AppInjector } from 'src/app/app.module';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from 'src/app/services/editor.service';
import { Behavior } from '../behavior';

export class BehaviorPFoldControl extends Behavior<MechanismParallel> implements IDisposable {
  protected mechanism: MechanismParallel;

  constructor(mechanism: MechanismParallel) {
    super(mechanism);
    this.mechanism = mechanism;

    const editorService = AppInjector.get(EditorService);
    SceneLoader.Append('assets/models/elements/', 'move-arrow.gltf', editorService.scene, function (scene: Scene) {});
  }
}
