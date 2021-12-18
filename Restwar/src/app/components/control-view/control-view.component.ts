import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EventState, Nullable, Observer, PointerInfo, Vector3, Scene, SceneLoader } from '@babylonjs/core';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Cube } from 'src/app/model/cube';
import { FaceRectangle } from 'src/app/model/faces/face.rectangle';
import { Sphere } from 'src/app/model/sphere';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

@Component({
  selector: 'control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['./control-view.component.scss'],
})
export class ControlViewComponent implements OnInit, OnDestroy, AfterViewInit {
  cube?: Cube;
  sphere?: Sphere;
  face?: FaceRectangle;
  picked: string = '';
  sceneEvents: Nullable<Observer<PointerInfo>>;

  constructor(private commandInvoker: CommandInvoker, private bsr: BasicRenderService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sceneEvents = this.bsr.scene.onPointerObservable.add((pointerInfo: PointerInfo, eventState: EventState) => {
      const mesh = pointerInfo.pickInfo?.pickedMesh;
      if (mesh != undefined && mesh != null) {
        this.picked = mesh.id;
      }
    });
  }

  ngOnDestroy(): void {
    const result = this.bsr.scene.onPointerObservable.remove(this.sceneEvents);
    if (!result) {
      alert('This observer could not be removed');
    }
  }

  /**
   * adds a cube to the scene
   */
  addCube() {
    if (this.sphere != undefined) {
      this.sphere.dispose();
    }
    this.cube = new Cube(new Vector3(3, 2, 1));
  }

  /**
   * adds a cube to the scene
   */
  addSphere() {
    this.sphere = new Sphere(new Vector3(1, 2, 3));
  }

  addPlane() {
    this.face = new FaceRectangle(4, 10, false, this.bsr.scene, null);
    this.face.onPickDown.subscribe((evt) => console.log(evt));
    //new FaceRectangle(4, 10, true, this.bsr.scene, null);
  }

  AppendModel() {
    SceneLoader.Append('assets/models/elements/', 'plane.gltf', this.bsr.scene, function (scene: Scene) {});
  }

  undo() {
    this.commandInvoker.undo();
  }

  redo() {
    this.commandInvoker.redo();
  }
}
