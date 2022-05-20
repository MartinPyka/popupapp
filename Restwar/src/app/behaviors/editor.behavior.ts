import { Subject, throwIfEmpty } from 'rxjs';
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

  constructor(protected editorService: EditorService) {
    super(editorService);
    this.onActivate = new Subject<void>();
    this.onDeactivate = new Subject<void>();
  }

  override dispose(): void {
    super.dispose();
    this.onActivate.complete();
    this.onDeactivate.complete();
  }
}
