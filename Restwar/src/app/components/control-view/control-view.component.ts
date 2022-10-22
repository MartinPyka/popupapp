import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EventState, Nullable, Observer, PointerInfo, Vector3, Scene, SceneLoader } from 'babylonjs';
import { EditorService } from 'src/app/services/editor.service';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Cube } from 'src/app/model/cube';
import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
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
  mecParallel: MechanismParallel;
  picked: string = '';
  sceneEvents: Nullable<Observer<PointerInfo>>;

  constructor(
    private commandInvoker: CommandInvoker,
    private bsr: BasicRenderService,
    private editorService: EditorService
  ) {}

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

  addMecParallel() {
    this.mecParallel = new MechanismParallel(this.mecActive.centerHinge);
    //this.mecParallel.addBehavior(BehaviorOrientation);
  }
}
