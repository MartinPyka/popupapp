import { Color3, Scene, StandardMaterial } from 'babylonjs';
import { Color } from 'paper/dist/paper-core';

const COLOR_HINGE = new Color3(0, 0.9, 0);
const COLOR_BOOKLET_HANDLE = new Color3(0.9, 0.0, 0.0);
const COLOR_BACKSIDE_DEBUG = new Color3(1.0, 0.9, 0.9);

// projection consts
export const COLOR_STROKE = 'black';

export class MaterialService {
  static matHingeSelectable: StandardMaterial;
  static matHingeMouseOver: StandardMaterial;
  static matHingeDefault: StandardMaterial;

  static matBookletHandle: StandardMaterial;

  static matBackSideDebug: StandardMaterial;

  public static initializeMaterial(scene: Scene) {
    MaterialService.matHingeMouseOver = new StandardMaterial('hingeSelected', scene);
    MaterialService.matHingeMouseOver.diffuseColor = COLOR_HINGE;

    MaterialService.matHingeSelectable = new StandardMaterial('hingeSelected', scene);
    MaterialService.matHingeSelectable.diffuseColor = COLOR_HINGE;
    MaterialService.matHingeSelectable.alpha = 0.4;

    MaterialService.matHingeDefault = new StandardMaterial('hingeDefault', scene);
    MaterialService.matHingeDefault.diffuseColor = COLOR_HINGE;
    MaterialService.matHingeDefault.alpha = 0.0;

    MaterialService.matBookletHandle = new StandardMaterial('bookletHandle', scene);
    MaterialService.matBookletHandle.diffuseColor = COLOR_BOOKLET_HANDLE;

    MaterialService.matBackSideDebug = new StandardMaterial('backside_debug', scene);
    MaterialService.matBackSideDebug.diffuseColor = COLOR_BACKSIDE_DEBUG;
  }
}
