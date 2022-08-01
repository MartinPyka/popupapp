import { Subject } from 'rxjs';
import { Channel } from '../core/channels';
import { EditorService } from '../services/editor.service';
import { Behavior } from './behavior';

/**
 * Abstract class for all behaviors that operatore on the editor service
 *
 * Any behavior that derives from the editor behavior 'just' needs to
 * implement an activate() and deactivate() method and call this.endBehavior()
 * when the behavior comes to an end. For an example, see AddPFoldBehavior
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
   *
   * The usage of a getter-property allows to alter this variable
   * in dervided classes and access this value in the constructor
   * of this method
   */
  get channelName(): string {
    return '';
  }

  constructor(protected editorService: EditorService) {
    super(editorService);
    this.onActivate = new Subject<void>();
    this.onDeactivate = new Subject<void>();
    this.editorService.registerWorkMode(this.channelName, (value) => this.trigger(value));
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

  /**
   * tells the editor service, that the behavior has come to an end
   */
  endBehavior(): void {
    this.editorService.triggerSelection(Channel.SELECTION_DEFAULT);
    this.editorService.setWorkMode(Channel.WORK_DEFAULT);
  }

  override dispose(): void {
    super.dispose();
    this.onActivate.complete();
    this.onDeactivate.complete();
  }
}
