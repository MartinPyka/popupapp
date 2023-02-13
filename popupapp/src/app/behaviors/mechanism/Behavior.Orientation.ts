import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { MechanismFolding } from 'src/app/model/mechanisms/mechanism.folding';
import { AxisObject } from 'src/app/model/utils/AxisObject';
import { Behavior } from '../behavior';
import { MechanismThreeHinge } from 'src/app/model/mechanisms/mechanism.threehinge';

/**
 * Adds orientation axis to a given object
 */
export class BehaviorOrientation extends Behavior<MechanismThreeHinge> {
  protected mechanism: MechanismThreeHinge;

  protected axisLeft: AxisObject;
  protected axisRight: AxisObject;

  protected axisRightLeft: AxisObject;
  protected axisRightRight: AxisObject;

  constructor(mechanism: MechanismThreeHinge) {
    super(mechanism);
    this.mechanism = mechanism as MechanismThreeHinge;

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;
    this.axisLeft = new AxisObject(scene, this.mechanism.leftHinge.leftTransform);
    this.axisRight = new AxisObject(scene, this.mechanism.leftHinge.rightTransform);
    this.axisRightLeft = new AxisObject(scene, this.mechanism.rightHinge.leftTransform);
    this.axisRightRight = new AxisObject(scene, this.mechanism.rightHinge.rightTransform);
  }

  public override dispose(): void {
    super.dispose();
    this.axisLeft.dispose();
    this.axisRight.dispose();
  }
}
