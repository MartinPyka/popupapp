import { IDisposable, Mesh, PointerDragBehavior, SceneLoader, Vector3 } from 'babylonjs';
import { AppInjector } from 'src/app/app.module';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from 'src/app/services/editor.service';
import { Behavior } from '../behavior';
import 'babylonjs-loaders';
import { BehaviorSubject } from 'rxjs';
import { changeNumberCommand } from 'src/app/core/undo/Command';
import { HeightPFoldControl } from './elements/Height.PFoldControl';

/**
 * UI-Elements in order to control the parameters of the mechanism
 */
export class BehaviorPFoldControl extends Behavior<MechanismParallel> implements IDisposable {
  protected mechanism: MechanismParallel;
  protected leftArrow: Mesh;
  protected rightArrow: Mesh;
  protected heightControl: HeightPFoldControl;

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

      this.heightControl = new HeightPFoldControl(mechanism);

      mesh.dispose();
    });
  }

  createModifyBehavior(arrow: Mesh, value: BehaviorSubject<number>) {
    let currentValue: number;
    let movedDistance: number;

    var pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(0, 1, 0) });

    pointerDragBehavior.onDragStartObservable.add((event) => {
      movedDistance = 0;
      currentValue = value.getValue();
    });

    pointerDragBehavior.onDragObservable.add((event) => {
      movedDistance += event.dragDistance;
      value.next(currentValue + movedDistance);
    });

    pointerDragBehavior.onDragEndObservable.add((event) => {
      let closureCommand = changeNumberCommand(value.getValue(), value, currentValue);
      this.commandInvoker.do(closureCommand);
    });

    arrow.addBehavior(pointerDragBehavior);
  }

  override dispose(): void {
    this.leftArrow.dispose();
    this.rightArrow.dispose();
    this.heightControl.dispose();
    super.dispose();
  }
}
