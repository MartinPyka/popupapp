import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';
import { Projection } from '../projection/projection';

const DEFAULT_STROKE_WIDTH = 0.1;
const DEFAULT_STROKE_COLOR = 'black';

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

  private _strokeWidth: BehaviorSubject<number>;

  public get strokeWidth(): Observable<number> {
    return this._strokeWidth.asObservable();
  }

  private _strokeColor: BehaviorSubject<string>;

  public get strokeColor(): Observable<string> {
    return this._strokeColor;
  }

  /**
   * list of all mechanisms used in the current editor
   */
  private readonly _listProjection: BehaviorSubject<Projection[]>;

  public get listProjection(): Observable<Projection[]> {
    return this._listProjection.asObservable();
  }

  constructor() {
    this._strokeWidth = new BehaviorSubject<number>(DEFAULT_STROKE_WIDTH);
    this._strokeColor = new BehaviorSubject<string>(DEFAULT_STROKE_COLOR);
    this._listProjection = new BehaviorSubject<Projection[]>([]);

    this.onDispose = new Subject<void>();

    this._strokeColor.pipe(takeUntil(this.onDispose)).subscribe((value) => this.updateStrokeColor(value));
    this._strokeWidth.pipe(takeUntil(this.onDispose)).subscribe((value) => this.updateStrokeWidth(value));
  }

  dispose(): void {
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
    projection.updateStrokeWidth(this._strokeWidth.getValue());
    projection.updateStrokeColor(this._strokeColor.getValue());
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
