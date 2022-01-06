import { Injectable } from '@angular/core';
import { Color3, Scene, StandardMaterial } from '@babylonjs/core';
import { AppInjector } from 'src/app/app.module';
import { BasicRenderService } from '../services/BasicRenderService';

const COLOR_HINGE = new Color3(0, 0.9, 0);
const COLOR_BOOKLET_HANDLE = new Color3(0.9, 0.0, 0.0);

export class MaterialService {
  static matHingeSelected: StandardMaterial;
  static matHingeDefault: StandardMaterial;

  static matBookletHandle: StandardMaterial;

  public static initializeMaterial(scene: Scene) {
    MaterialService.matHingeSelected = new StandardMaterial('hingeSelected', scene);
    MaterialService.matHingeSelected.diffuseColor = COLOR_HINGE;

    MaterialService.matHingeDefault = new StandardMaterial('hingeDefault', scene);
    MaterialService.matHingeDefault.diffuseColor = COLOR_HINGE;
    MaterialService.matHingeDefault.alpha = 0.4;

    MaterialService.matBookletHandle = new StandardMaterial('bookletHandle', scene);
    MaterialService.matBookletHandle.diffuseColor = COLOR_BOOKLET_HANDLE;
  }
}
