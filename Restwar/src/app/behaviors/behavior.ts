import { Mechanism } from '../model/mechanisms/mechanism';
import { IDisposable } from '@babylonjs/core';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior implements IDisposable {
  constructor(mechanism: Mechanism) {}

  dispose(): void {}
}
