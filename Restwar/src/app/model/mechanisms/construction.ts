import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IModelDisposable } from '../interfaces/interfaces';
import { Mechanism } from './mechanism';
import { ConstructionService } from '../../services/construction.service';

/**
 * This class holds and manages an entire paper construction.
 * It also provides functionalities for other classes to make
 * modifications on the construction, retrieve information or
 * alter certain elements of it
 */
export class Construction implements IModelDisposable {
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
    this._listMechanisms = new BehaviorSubject<Mechanism[]>([]);
    this.onDispose = new Subject<void>();

    if (createRoot) {
      this.createDefaultRoot();
    }
  }

  dispose(): void {
    this.clear();
    this._listMechanisms.complete();

    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * creates a default root for the construction
   */
  private createDefaultRoot(): void {
    this._rootObject = ConstructionService.createActiveMechanism();
    this.push(this._rootObject);
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
  private push(mechanism: Mechanism): void {
    this._listMechanisms.next([...this._listMechanisms.getValue(), mechanism]);
  }
}
