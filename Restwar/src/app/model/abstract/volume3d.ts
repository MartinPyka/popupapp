import { ActionManager, ExecuteCodeAction, Mesh, PointerDragBehavior, Vector3 } from '@babylonjs/core';
import { BehaviorSubject, Subscription, takeUntil } from 'rxjs';
import { AppInjector } from 'src/app/app.module';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Object3D } from './object3d';

/**
 * temporary helper class that shows modifiable 3d volumes based
 * on Object3D
 */
export abstract class Volume3D extends Object3D {
  // list of subscriptions that need to be unsubscribed on destroy
  readonly position: BehaviorSubject<Vector3>;
  oldPosition: Vector3;
  mesh: Mesh;

  constructor(position: Vector3, mesh: Mesh) {
    super();
    let commmandInvoker = AppInjector.get(CommandInvoker);

    this.position = new BehaviorSubject<Vector3>(position);
    this.mesh = mesh;

    // any change in the model variable should affect the mesh
    this.position.pipe(takeUntil(this.onDispose)).subscribe((x) => (this.mesh.position = x));

    this.mesh.addBehavior(new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) }));

    // when the mouse is pressed, we need to save the current position in order to have it
    // for undo-functionality
    this.mesh.actionManager?.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => (this.oldPosition = this.position.value.clone()))
    );

    this.mesh.actionManager?.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, (evt) => {
        // the overly excessive use of the clone function is
        // necessary to make sure that we have a call by value
        // and not a call by reference, as this causes problems in
        // reverting and redoing commands
        let oldValue = this.oldPosition.clone();
        let newValue = this.mesh.position.clone();

        let doAction = (): CommandParts => {
          this.position.next(newValue.clone());

          let undo = (): boolean => {
            this.position.next(oldValue.clone());
            return true;
          };

          let redo = (): boolean => {
            this.position.next(newValue);
            return true;
          };

          return new CommandParts(undo, redo, undefined, undefined);
        };
        commmandInvoker.do(new ClosureCommands(doAction));
      })
    );
  }

  /**
   * performs obligatory tasks before the object can be collected
   * by the garbage collection, e.g. unsubscribe all ongoing subscriptions
   */
  override dispose() {
    super.dispose();
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }
  }
}
