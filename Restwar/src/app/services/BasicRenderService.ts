import { ElementRef, Inject, Injectable, NgZone } from '@angular/core';
import {
  ActionManager,
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  DynamicTexture,
  Engine,
  FreeCamera,
  HemisphericLight,
  Light,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { DOCUMENT } from '@angular/common';
import '@babylonjs/inspector';
import { MaterialService } from '../materials/material-service';

@Injectable({
  providedIn: 'root',
})
export class BasicRenderService {
  engine!: Engine;
  protected canvas!: HTMLCanvasElement;
  protected camera!: FreeCamera | ArcRotateCamera;
  protected light!: Light;

  scene!: Scene;

  public constructor(private readonly ngZone: NgZone, @Inject(DOCUMENT) readonly document: Document) {}

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';
    this.engine = new Engine(this.canvas, true);

    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

    // disable loading screen as it would interrupt the loading experience
    SceneLoader.ShowLoadingScreen = false;

    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    const light2 = new DirectionalLight('light2', new Vector3(1, 1, 0), this.scene);

    // generates the world x-y-z axis for better understanding
    this.showWorldAxis(8);

    // rotate scene by mouse-move
    let clicked = false;
    let mousemov = false;
    let framecount = 0;
    const mxframecount = 120; //4 secs at 60 fps

    this.scene.beforeRender = () => {
      mousemov = false;
    };

    this.scene.afterRender = () => {
      if (!mousemov && framecount < mxframecount) {
        framecount++;
      } else if (framecount >= mxframecount) {
        framecount = 0;
      }
    };

    this.camera = new ArcRotateCamera('Camera', 0, 0.8, 35, Vector3.Zero(), this.scene);
    this.camera.setTarget(new Vector3(0, 0, 0));
    this.camera.attachControl(false);
    this.camera.inputs.clear();

    canvas.nativeElement.addEventListener('pointerdown', (evt) => {
      clicked = true;
    });

    canvas.nativeElement.addEventListener('pointermove', (evt) => {
      if (clicked) {
        mousemov = true;
      }
      if (!clicked) {
        return;
      }
    });

    canvas.nativeElement.addEventListener('pointerup', () => {
      clicked = false;
    });

    MaterialService.initializeMaterial(this.scene);
  }

  start(inZone = true): void {
    if (inZone) {
      this.ngZone.runOutsideAngular(() => {
        this.startTheEngine();
      });
    } else {
      this.startTheEngine();
    }
  }

  stop(): void {
    this.scene.dispose();
    this.engine.stopRenderLoop();
    this.engine.dispose();
    this.camera.dispose();
    window.removeEventListener('resize', () => {});
  }

  createCube(position: Vector3): Mesh {
    var mesh = MeshBuilder.CreateBox('box', { size: 2 }, this.scene);
    mesh.position = position;
    mesh.actionManager = new ActionManager(this.scene);
    return mesh;
  }

  createSphere(position: Vector3): Mesh {
    var mesh = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, this.scene);
    mesh.position = position;
    mesh.actionManager = new ActionManager(this.scene);
    return mesh;
  }

  private startTheEngine() {
    let freshRender = true;
    const element = this.document.getElementById('fpsLabel');

    this.engine.runRenderLoop(() => {
      this.scene.render();
      if (element) {
        element.innerHTML = this.engine.getFps().toFixed() + ' fps';
      }
      if (freshRender) {
        this.engine.resize();
        freshRender = false;
      }
    });
    window.addEventListener('resize', () => this.engine.resize());
  }

  /**
   * Source: https://doc.babylonjs.com/snippets/world_axes
   * @param size number
   */
  showWorldAxis(size: number) {
    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
      this.scene,
      false,
      undefined
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = this.makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
      this.scene,
      false,
      undefined
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = this.makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
      this.scene,
      false,
      undefined
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = this.makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }

  makeTextPlane(text: string, color: string, textSize: number) {
    const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
    const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
    const material = new StandardMaterial('TextPlaneMaterial', this.scene);
    material.backFaceCulling = false;
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    plane.material = material;

    return plane;
  }
}
