import { Subject, throwIfEmpty } from 'rxjs';
import { Channel } from '../core/channels';
import { EditorService } from '../services/editor.service';
import { Behavior } from './behavior';

/**
 * Abstract class for all behaviors that operatore on the editor service
 */
export abstract class EditorBehavior extends Behavior<EditorService> {
  // fires, when the behavior is activated
  readonly onActivate: Subject<void>;

  // fires, when the behavior is deactivated
  readonly onDeactivate: Subject<void>;

  /**
   * Name that determines for which key word the behavior gets activated.
   * Every sub class needs to assign a unique name to this variable,
   * which is used to register the behavior in the editor service.
   */
  readonly channelName: string;

  constructor(protected editorService: EditorService) {
    super(editorService);
    this.onActivate = new Subject<void>();
    this.onDeactivate = new Subject<void>();
    this.editorService.registerWorkMode(Channel.WORK_PFold, (value) => this.trigger(value));
  }

  trigger(value: boolean) {
    if (value) {
      this.activate();
      this.onActivate.next();
    } else {
      this.deactivate();
      this.onDeactivate.next();
    }
  }

  /**
   * function that is triggered when the behavior is activated
   */
  activate(): void {}

  /**
   * function that is triggered when the behavior is deactivated
   */
  deactivate(): void {}

  override dispose(): void {
    super.dispose();
    this.onActivate.complete();
    this.onDeactivate.complete();
  }
}
