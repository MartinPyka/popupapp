import { Face } from 'src/app/model/abstract/face';
import { Mesh, SceneLoader, Vector2, Vector3 } from 'babylonjs';
import { takeUntil } from 'rxjs';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { deg2rad } from 'src/app/utils/math';
import { HitPlane } from 'src/app/model/utils/HitPlane';

/**
 * UI Element for enabling the user to configure the height
 * of a PFold via a 3d object. It extends Face as Face brings
 * already onMouseDown, -Up and -Move events
 */
export class HeightPFoldControl extends Face {
  mechanism: MechanismParallel;
  private height: number;
  private hitPlane: HitPlane;

  constructor(mechanism: MechanismParallel) {
    super(null);
    this.mechanism = mechanism;
    const editorService = AppInjector.get(EditorService);
    SceneLoader.ImportMesh('Arrow', 'assets/models/elements/', 'move-arrow.glb', editorService.scene, (meshes) => {
      this.mesh = meshes[1] as Mesh;
      this.configureMesh();
      this.calculateArrowOrientation();
      this.registerClickEvents();
      this.createHitPlane();
    });
    this.registerEvents();
  }

  /**
   * configures the position and orientation of the mesh
   */
  configureMesh() {
    this.transform.parent = this.mechanism.centerHinge.transform;
    this.setParent(this.transform);

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

    this.transform.lookAt(target);
    this.transform.rotate(new Vector3(0, 1, 0), deg2rad(90));
    this.transform.rotate(new Vector3(0, 0, 1), deg2rad(90));
  }

  createHitPlane() {
    this.hitPlane = new HitPlane(this.transform);
  }

  registerEvents() {
    let moveDirection: Vector2;
    let startPosition: Vector2;

    /**
     * onMouseDown-event ===============================================================
     */
    this.onMouseDown.pipe(takeUntil(this.onDispose)).subscribe((faceClick) => {
      this.height = this.mechanism.height.getValue();
      this.editorService.setCameraState(false);

      // determine the moveDirection in space of the center hinge
      const absMoveDirection = this.mechanism.centerHinge.transform.absolutePosition.subtract(
        this.mechanism.parentHinge.transform.absolutePosition
      );
      const matrix = this.mechanism.centerHinge.transform.getWorldMatrix();
      const tempMoveDirection = Vector3.TransformCoordinates(
        absMoveDirection.add(this.mechanism.centerHinge.transform.absolutePosition),
        matrix.invert()
      );
      moveDirection = new Vector2(tempMoveDirection.y, tempMoveDirection.z);
      console.log('MoveDirection: ', moveDirection);
      const ray = this.editorService.scene.createPickingRay(
        faceClick.event.pointerX,
        faceClick.event.pointerY,
        null,
        null
      );
      startPosition = this.hitPlane.getHitLocation(ray);
      console.log(startPosition);
    });

    /**
     * onMouseMove-event ===============================================================
     */
    this.onMouseMove.pipe(takeUntil(this.onDispose)).subscribe((faceMove) => {
      if (faceMove.event.pickInfo?.ray) {
        const currentPosition = this.hitPlane.getHitLocation(faceMove.event.pickInfo.ray);
        console.log(currentPosition);
        const dotProduct = Vector2.Dot(moveDirection, currentPosition.subtract(startPosition));
        console.log('Dot Product: ', dotProduct);
        this.mechanism.height.next(this.height - dotProduct / 10);
      }
    });

    /**
     * onMouseUp-event =================================================================
     */
    this.onMouseUp.pipe(takeUntil(this.onDispose)).subscribe((FaceUp) => {
      this.editorService.setCameraState(true);
    });
  }
}
