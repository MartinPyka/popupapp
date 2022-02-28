import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { MechanismFolding } from 'src/app/model/mechanisms/mechanism.folding';
import { AxisObject } from 'src/app/model/utils/AxisObject';
import { Behavior } from '../behavior';

export class BehaviorOrientation extends Behavior {
  protected mechanism: MechanismFolding;

  protected axisLeft: AxisObject;
  protected axisRight: AxisObject;

  constructor(mechanism: MechanismFolding) {
    super(mechanism);
    this.mechanism = mechanism as MechanismFolding;

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;
    this.axisLeft = new AxisObject(scene, this.mechanism.centerHinge.leftTransform);
    this.axisRight = new AxisObject(scene, this.mechanism.centerHinge.rightTransform);
  }

  public override dispose(): void {
    super.dispose();
    this.axisLeft.dispose();
    this.axisRight.dispose();
  }
}
