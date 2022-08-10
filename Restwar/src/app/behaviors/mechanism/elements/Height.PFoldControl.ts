import { Face } from 'src/app/model/abstract/face';
import { Mesh, Scene, SceneLoader, Vector3 } from 'babylonjs';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { deg2rad } from 'src/app/utils/math';

/**
 * UI Element for enabling the user to configure the height
 * of a PFold via a 3d object. It extends Face as Face brings
 * already onMouseDown, -Up and -Move events
 */
export class HeightPFoldControl extends Face {
  mechanism: MechanismParallel;

  constructor(mechanism: MechanismParallel) {
    super(null);
    this.mechanism = mechanism;
    const editorService = AppInjector.get(EditorService);
    SceneLoader.ImportMesh('Arrow', 'assets/models/elements/', 'move-arrow.glb', editorService.scene, (meshes) => {
      this.mesh = meshes[1] as Mesh;
      this.configureMesh();
    });
  }

  /**
   * configures the position and orientation of the mesh
   */
  configureMesh() {
    this.mesh.parent = this.mechanism.centerHinge.transform;

    // mesh should face the user
    this.mechanism.leftDistance.pipe(takeUntil(this.onDispose)).subscribe((_) => this.calculateArrowOrientation());
    this.mechanism.rightDistance.pipe(takeUntil(this.onDispose)).subscribe((_) => this.calculateArrowOrientation());
  }

  /**
   * calculates the orientation of the height arrow
   */
  calculateArrowOrientation() {
    let distance = this.mechanism.rightHinge.transform.absolutePosition.subtract(
      this.mechanism.leftHinge.transform.absolutePosition
    );
    let fraction =
      this.mechanism.rightDistance.getValue() /
      (this.mechanism.leftDistance.getValue() + this.mechanism.rightDistance.getValue());
    let newPosition = this.mechanism.leftHinge.transform.absolutePosition.add(distance.scale(fraction));

    let matrix = this.mechanism.centerHinge.transform.getWorldMatrix();

    let target = Vector3.TransformCoordinates(newPosition, matrix.invert());

    this.mesh.lookAt(target);
    this.mesh.rotate(new Vector3(0, 1, 0), deg2rad(90));
    this.mesh.rotate(new Vector3(0, 0, 1), deg2rad(90));
  }
}
