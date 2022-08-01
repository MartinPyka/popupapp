import { AbstractMesh, IDisposable, Mesh, SceneLoader } from 'babylonjs';
import { AppInjector } from 'src/app/app.module';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from 'src/app/services/editor.service';
import { Behavior } from '../behavior';
import 'babylonjs-loaders';

export class BehaviorPFoldControl extends Behavior<MechanismParallel> implements IDisposable {
  protected mechanism: MechanismParallel;
  protected leftArrow: Mesh;
  protected rightArrow: Mesh;

  constructor(mechanism: MechanismParallel) {
    super(mechanism);
    this.mechanism = mechanism;

    const editorService = AppInjector.get(EditorService);
    SceneLoader.ImportMesh('Arrow', 'assets/models/elements/', 'move-arrow.glb', editorService.scene, (meshes) => {
      let mesh = meshes[1] as Mesh;
      this.leftArrow = mesh.clone();
      this.leftArrow.parent = this.mechanism.leftHinge.transform;

      this.rightArrow = mesh.clone();
      this.rightArrow.parent = this.mechanism.rightHinge.transform;

      mesh.dispose();
    });
  }

  override dispose(): void {
    this.leftArrow.dispose();
    this.rightArrow.dispose();
    super.dispose();
  }
}
