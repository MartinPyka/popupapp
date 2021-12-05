/**
 * Stack with limited storing capability, to prevent memory problems
 */
export class LimitedStack<T> {
  _store: T[];
  _limit: number;

  public constructor(limit: number) {
    this._limit = limit;
    this._store = [];
  }

  /**
   * Pushes an item of type T onto the stack. however
   * when the stack is full, the one that gets kicked
   * out is returned
   * @param val item of type T that should be placed on
   * the stack
   */
  public push(val: T): T | undefined {
    this._store.push(val);
    let result: T | undefined = undefined;
    if (this._store.length > this._limit) {
      result = this._store.shift();
    }
    return result;
  }

  public pop(): T | undefined {
    return this._store.pop();
  }

  public length(): number {
    return this._store.length;
  }
}
