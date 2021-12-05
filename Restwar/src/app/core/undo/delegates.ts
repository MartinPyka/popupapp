/**
 * define a simple interface for a function with zero
 * inputs and zero outputs
 */
export interface Action {
  (): void;
}

export interface BoolAction {
  (): boolean;
}
