import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';
import { Projection } from '../projection/projection';

const DEFAULT_STROKE_WIDTH = 0.1;
const DEFAULT_STROKE_COLOR = 'black';
const DEFAULT_GLUESTRIP_WIDTH = 0.5;
const DEFAULT_GLUESTRIP_OFFSET = 0.5;

/**
 * This service takes care of all properties and functions
 * related to the projections of popups. General view
 * settings as well as export and visibility functions are
 * handeled by this service
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectionService implements IModelDisposable {
  readonly onDispose: Subject<void>;

  public strokeWidth: BehaviorSubject<number>;

  public strokeColor: BehaviorSubject<string>;

  public glueStripWidth: BehaviorSubject<number>;

  public glueStripOffset: BehaviorSubject<number>;

  /**
   * list of all mechanisms used in the current editor
   */
  private readonly _listProjection: BehaviorSubject<Projection[]>;

  public get listProjection(): Observable<Projection[]> {
    return this._listProjection.asObservable();
  }

  constructor() {
    this.strokeWidth = new BehaviorSubject<number>(DEFAULT_STROKE_WIDTH);
    this.strokeColor = new BehaviorSubject<string>(DEFAULT_STROKE_COLOR);
    this.glueStripWidth = new BehaviorSubject<number>(DEFAULT_GLUESTRIP_WIDTH);
    this.glueStripOffset = new BehaviorSubject<number>(DEFAULT_GLUESTRIP_OFFSET);
    this._listProjection = new BehaviorSubject<Projection[]>([]);

    this.onDispose = new Subject<void>();

    this.strokeColor.pipe(takeUntil(this.onDispose)).subscribe((value) => this.updateStrokeColor(value));
    this.strokeWidth.pipe(takeUntil(this.onDispose)).subscribe((value) => this.updateStrokeWidth(value));
  }

  dispose(): void {
    this.strokeWidth.complete();
    this.strokeColor.complete();
    this.glueStripWidth.complete();
    this.glueStripOffset.complete();
    this._listProjection.complete();

    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * a projection that is added to the projection service
   * gets all the updates that are needed to conform to the
   * overall design properties
   */
  public add(projection: Projection) {
    this.formatProjection(projection);
    this._listProjection.next([...this._listProjection.getValue(), projection]);
  }

  /**
   * assigns the current formating settings to the projection
   * @param projection to be updated
   */
  private formatProjection(projection: Projection) {
    projection.updateStrokeWidth(this.strokeWidth.getValue());
    projection.updateStrokeColor(this.strokeColor.getValue());
  }

  /**
   * updates the stroke width for all projections
   * @param value stroke width
   */
  private updateStrokeWidth(value: number) {
    this._listProjection.getValue().forEach((projection) => projection.updateStrokeWidth(value));
  }

  /**
   * updates the stroke color for all projections
   * @param value stroke color
   */
  private updateStrokeColor(value: string) {
    this._listProjection.getValue().forEach((projection) => projection.updateStrokeColor(value));
  }
}
