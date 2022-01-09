import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EventState, Nullable, Observer, PointerInfo, Vector3, Scene, SceneLoader } from '@babylonjs/core';
import { BehaviorBookletControl } from 'src/app/behaviors/mechanism/Behavior.BookletControl';
import { Emitter } from 'src/app/core/emitter';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Cube } from 'src/app/model/cube';
import { HingeActive } from 'src/app/model/hinges/hinge.active';
import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { PlaneRectangle } from 'src/app/model/planes/plane.rectangle';
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
  plane?: PlaneRectangle;
  mecActive: MechanismActive;
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
    this.plane = new PlaneRectangle(4, 10, this.bsr.scene, null);
    this.plane.onPickDown.subscribe((evt) => console.log(evt));
  }

  addHinge() {
    const hinge = new HingeActive(null, this.bsr.scene);
  }

  addMecActive() {
    this.mecActive = new MechanismActive(null);
    this.mecActive.leftAngle.next(-45);
    this.mecActive.rightAngle.next(-60);
    //const beh = new BehaviorBookletControl(this.mecActive);
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
