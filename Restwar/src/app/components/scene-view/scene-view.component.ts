import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

@Component({
  selector: 'scene-view',
  templateUrl: './scene-view.component.html',
  styleUrls: ['./scene-view.component.scss'],
})
export class SceneViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('rCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(protected readonly basicRenderService: BasicRenderService) {}

  ngOnInit(): void {
    this.initSceneAndEditor();
  }

  initSceneAndEditor() {
    this.basicRenderService.createScene(this.canvasRef);
  }

  ngAfterViewInit(): void {
    // start the engine
    // be aware that we have to setup the scene before
    this.basicRenderService.start(true);
  }

  ngOnDestroy(): void {
    // stop the engine and clean up
    this.basicRenderService.stop();
  }
}
