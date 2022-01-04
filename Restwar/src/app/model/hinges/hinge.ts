import {
  ActionManager,
  ExecuteCodeAction,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
  Action,
} from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/materials/material-service';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IModelDisposable } from '../interfaces/interfaces';

// constants
const CYLINDER_HEIGHT = 1;
const CYLINDER_DIAMETER = 0.5;
const CYLINDER_TESSELATION = 8;

/**
 * basic hinge class for all kinds of mechanisms that use
 * hinges
 */
export abstract class Hinge extends TransformObject3D implements IModelDisposable {
  private _width: number;

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    if (value < 0) {
      return;
    }
    this._width = value;
    this.mesh.scaling.y = value;
  }

  /**
   * Left side of the hinge. Every object is attached to this
   * transform
   */
  readonly leftTransform: TransformObject3D;

  /**
   * Right side of the hinge. Every object is attached to this
   * transform
   */
  readonly rightTransform: TransformObject3D;

  readonly actionList: Action[];

  protected materialDefault: Material;
  protected materialSelected: Material;

  /**
   * mesh that repesents the hinge
   */
  private _mesh: Mesh;

  public get mesh(): Mesh {
    return this._mesh;
  }

  constructor(parent: TransformObject3D | null, scene: Scene) {
    super(parent);
    this.leftTransform = new TransformObject3D(parent);
    this.rightTransform = new TransformObject3D(parent);
    this.actionList = [];

    // the right side is flipped by 180° on the y-axis,
    // so that the z-axis of the faces are within the 0-180
    // degree fold
    this.rightTransform.transform.rotation.y = Math.PI;

    this.configureMaterials();
    this.createGeometry(scene);
    this.registerEvents();
  }

  override dispose(): void {
    super.dispose();
    this.actionList.forEach((action) => this.mesh.actionManager?.unregisterAction(action));
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }
  }

  /**
   * Creates the geometry
   *
   * @param scene scene for registering the mesh
   */
  protected createGeometry(scene: Scene) {
    this._mesh = MeshBuilder.CreateCylinder(
      'cylinder',
      {
        height: CYLINDER_HEIGHT,
        diameter: CYLINDER_DIAMETER,
        tessellation: CYLINDER_TESSELATION,
      },
      scene
    );

    // rotate the hinge by 90° into its standard orientation
    this.mesh.rotate(new Vector3(0, 0, 1), Math.PI / 2);
    this.mesh.material = this.materialDefault;
  }

  /**
   * configures the materials for the hinge. They are loaded from
   * a static class
   */
  protected configureMaterials() {
    this.materialDefault = MaterialService.matHingeDefault;
    this.materialSelected = MaterialService.matHingeSelected;
  }

  /**
   * registers all events
   */
  protected registerEvents() {
    this.mesh.actionManager = new ActionManager(this.mesh.getScene());

    this.actionList.push(
      new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt) => {
        this.mesh.material = this.materialSelected;
      })
    );
    this.actionList.push(
      new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (evt) => {
        this.mesh.material = this.materialDefault;
      })
    );

    this.actionList.forEach((action) => this.mesh.actionManager?.registerAction(action));
  }
}
