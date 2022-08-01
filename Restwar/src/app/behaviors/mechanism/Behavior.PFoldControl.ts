import { IDisposable, SceneLoader } from '@babylonjs/core';
import { AppInjector } from 'src/app/app.module';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from 'src/app/services/editor.service';
import { Behavior } from '../behavior';
import { GLTF2 } from 'babylonjs-loaders';

export class BehaviorPFoldControl extends Behavior<MechanismParallel> implements IDisposable {
  protected mechanism: MechanismParallel;

  constructor(mechanism: MechanismParallel) {
    super(mechanism);
    this.mechanism = mechanism;

    const editorService = AppInjector.get(EditorService);
    SceneLoader.ImportMesh('', 'assets/models/elements/', 'plane.gltf', editorService.scene, function (meshes) {
      console.log(meshes);
    });
  }
}
