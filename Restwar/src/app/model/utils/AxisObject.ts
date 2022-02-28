import {
  Color3,
  DynamicTexture,
  LinesMesh,
  Mesh,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { TransformObject3D } from '../abstract/transform.object3d';

export class AxisObject extends TransformObject3D {
  axisX: LinesMesh;
  axisY: LinesMesh;
  axisZ: LinesMesh;
  xChar: Mesh;
  yChar: Mesh;
  zChar: Mesh;

  constructor(scene: Scene, parent: TransformObject3D | null) {
    super(parent);
    this.createAxis(5, scene);
  }

  public override dispose(): void {
    super.dispose();
    this.axisX.dispose();
    this.axisY.dispose();
    this.axisZ.dispose();
    this.xChar.dispose();
    this.yChar.dispose();
    this.zChar.dispose();
  }

  private createAxis(size: number, scene: Scene) {
    this.axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
      scene,
      false,
      undefined
    );
    this.axisX.parent = this.transform;

    this.axisX.color = new Color3(1, 0, 0);
    this.xChar = this.makeTextPlane('X', 'red', size / 10, scene);
    this.xChar.parent = this.transform;
    this.xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    this.axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
      scene,
      false,
      undefined
    );
    this.axisY.parent = this.transform;

    this.axisY.color = new Color3(0, 1, 0);
    this.yChar = this.makeTextPlane('Y', 'green', size / 10, scene);
    this.yChar.parent = this.transform;
    this.yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    this.axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
      scene,
      false,
      undefined
    );
    this.axisZ.parent = this.transform;

    this.axisZ.color = new Color3(0, 0, 1);
    this.zChar = this.makeTextPlane('Z', 'blue', size / 10, scene);
    this.zChar.parent = this.transform;
    this.zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }

  private makeTextPlane(text: string, color: string, textSize: number, scene: Scene): Mesh {
    const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
    const plane = Mesh.CreatePlane('TextPlane', textSize, scene, true);
    plane.parent = this.transform;
    const material = new StandardMaterial('TextPlaneMaterial', scene);
    material.backFaceCulling = false;
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    plane.material = material;

    return plane;
  }
}
