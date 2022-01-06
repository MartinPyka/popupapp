import { Observer, Subject, Subscription } from 'rxjs';

/**
 * subjects is a dictionary with the signature:
 *   key is of type string
 *   value is of type Subject<T>
 */
interface SubjectDictionary<T> {
  [index: string]: Subject<T>;
}

/**
 * This class is an RxJS based Event Emitter, like in the standard Node package
 * events. The difference with this event is, it is based on RxJS and therefore
 * asynchronous.
 * With this class a generic form of EventEmitter can be generated based on a
 * type T.
 */
export class Emitter<T> {
  /**
   * subjects is a dictionary with a certain signature (see above)
   */
  subjects: SubjectDictionary<T> = {};

  /**
   * Emits an event for a given event name
   *
   * @param name name of the event
   * @param data data to be submitted
   */
  public emit(name: string, data: T) {
    if (!this.subjects.hasOwnProperty(name)) {
      this.subjects[name] = new Subject<T>();
    }
    this.subjects[name].next(data);
  }

  /**
   * Registers a handler for a given event
   *
   * @param name name of the event
   * @param handler handler for the event
   * @returns Subscription
   */
  public on(name: string, handler: (value: T) => void): Subscription {
    if (!this.subjects.hasOwnProperty(name)) {
      this.subjects[name] = new Subject<T>();
    }

    return this.subjects[name].subscribe(handler);
  }

  /**
   * Completes the subject and deletes it subsequently.
   *
   * @param name name of the subject
   */
  public off(name: string) {
    if (this.subjects.hasOwnProperty(name)) {
      this.subjects[name].complete();
      delete this.subjects[name];
    }
  }
}
