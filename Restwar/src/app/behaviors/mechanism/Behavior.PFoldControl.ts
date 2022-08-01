import { IDisposable, Mesh, PointerDragBehavior, SceneLoader, Vector3 } from 'babylonjs';
import { AppInjector } from 'src/app/app.module';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from 'src/app/services/editor.service';
import { Behavior } from '../behavior';
import 'babylonjs-loaders';
import { BehaviorSubject } from 'rxjs';

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

      this.createModifyBehavior(this.leftArrow, mechanism.leftDistance);
      this.createModifyBehavior(this.rightArrow, mechanism.rightDistance);

      mesh.dispose();
    });
  }

  createModifyBehavior(arrow: Mesh, value: BehaviorSubject<number>) {
    let currentValue: number;
    let startValue: number;
    let movedDistance: number;

    var pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) });

    pointerDragBehavior.onDragStartObservable.add((event) => {
      movedDistance = 0;
      currentValue = value.getValue();
      console.log('StartPosition: ' + arrow.position);
      startValue = arrow.position.y;

      console.log(currentValue);
      console.log(startValue);
    });

    pointerDragBehavior.onDragObservable.add((event) => {
      console.log('Position: ' + arrow.position);
      //movedDistance = arrow.position.y - startValue;
      movedDistance += event.dragDistance;
      console.log('Moved Distance: ' + movedDistance);
      console.log('New Value: ' + (currentValue + movedDistance));
      value.next(currentValue + movedDistance);
      console.log('Delta: ' + event.dragDistance);
    });

    pointerDragBehavior.onDragEndObservable.add((event) => {
      console.log('dragEnd');
    });

    arrow.addBehavior(pointerDragBehavior);
  }

  override dispose(): void {
    this.leftArrow.dispose();
    this.rightArrow.dispose();
    super.dispose();
  }
}
