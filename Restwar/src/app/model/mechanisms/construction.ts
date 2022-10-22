import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IModelDisposable, MechanismFaceClick, MechanismHingeClick } from '../interfaces/interfaces';
import { Mechanism } from './mechanism';
import { ConstructionService } from '../../services/construction.service';
import { ThinSprite } from 'babylonjs/Sprites/thinSprite';

/**
 * This class holds and manages an entire paper construction.
 * It also provides functionalities for other classes to make
 * modifications on the construction, retrieve information or
 * alter certain elements of it
 */
export class Construction implements IModelDisposable {
  private readonly _onFaceDown: Subject<MechanismFaceClick>;
  private readonly _onFaceUp: Subject<MechanismFaceClick>;
  private readonly _onFaceMove: Subject<MechanismFaceClick>;

  private readonly _onHingeDown: Subject<MechanismHingeClick>;
  private readonly _onHingeUp: Subject<MechanismHingeClick>;
  private readonly _onHingeMove: Subject<MechanismHingeClick>;

  public get onFaceDown(): Observable<MechanismFaceClick> {
    return this._onFaceDown.asObservable();
  }

  public get onHingeDown(): Observable<MechanismHingeClick> {
    return this._onHingeDown.asObservable();
  }

  /**
   * list of all mechanisms used in the current editor
   */
  private readonly _listMechanisms: BehaviorSubject<Mechanism[]>;

  public get listMechanism(): Observable<Mechanism[]> {
    return this._listMechanisms.asObservable();
  }

  // an event that fires, when the Object3D is diposed
  readonly onDispose: Subject<void>;

  /**
   * root object of the entire paper construction
   */
  private _rootObject: Mechanism;

  /**
   * Creates a paper construction. In the default case
   * a MechanismActive is created
   * @param createRoot
   */
  constructor(createRoot: Boolean = true) {
    this._onFaceDown = new Subject<MechanismFaceClick>();
    this._onFaceUp = new Subject<MechanismFaceClick>();
    this._onFaceMove = new Subject<MechanismFaceClick>();
    this._onHingeDown = new Subject<MechanismHingeClick>();
    this._onHingeUp = new Subject<MechanismHingeClick>();
    this._onHingeMove = new Subject<MechanismHingeClick>();
    this._listMechanisms = new BehaviorSubject<Mechanism[]>([]);
    this.onDispose = new Subject<void>();

    if (createRoot) {
      this.createDefaultRoot();
    }
  }

  dispose(): void {
    this.clear();
    this._onFaceDown.complete();
    this._onFaceUp.complete();
    this._onFaceMove.complete();
    this._onHingeDown.complete();
    this._onHingeUp.complete();
    this._onHingeMove.complete();
    this._listMechanisms.complete();

    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * creates a default root for the construction
   */
  private createDefaultRoot(): void {
    this._rootObject = ConstructionService.createActiveMechanism();
    this.add(this._rootObject);
  }

  /** clears the entire list */
  private clear(): void {
    this._listMechanisms.getValue().forEach((mec) => {
      mec.dispose();
    });
    this._listMechanisms.next([]);
  }

  /**
   * adds a ready-made mechanism to the construction and fires the
   * behavior subject
   * @param mechanism mechanism that should be added to the construction
   */
  public add(mechanism: Mechanism): void {
    mechanism.onFaceDown
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismFaceClick) => this._onFaceDown.next(mechanismFaceClick));
    mechanism.onFaceUp
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismFaceClick) => this._onFaceUp.next(mechanismFaceClick));
    mechanism.onFaceMove
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismFaceClick) => this._onFaceMove.next(mechanismFaceClick));
    mechanism.onHingeDown
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismHingeClick) => this._onHingeDown.next(mechanismHingeClick));
    mechanism.onHingeUp
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismHingeClick) => this._onHingeUp.next(mechanismHingeClick));
    mechanism.onHingeMove
      .pipe(takeUntil(this.onDispose), takeUntil(mechanism.onInvisible))
      .subscribe((mechanismHingeClick) => this._onHingeMove.next(mechanismHingeClick));
    this._listMechanisms.next([...this._listMechanisms.getValue(), mechanism]);
  }

  /**
   * Removes a mechanism from the construction list and fires the behavior subject
   * for the listMechanism
   * @param mechanism to be remove
   * @returns
   */
  public remove(mechanism: Mechanism): void {
    const index = this._listMechanisms.value.findIndex((value) => value.id === mechanism.id);
    if (index === -1) {
      return;
    }
    const newListMechanism = this._listMechanisms.value;
    newListMechanism.splice(index, 1);
    this._listMechanisms.next(newListMechanism);
  }
}
