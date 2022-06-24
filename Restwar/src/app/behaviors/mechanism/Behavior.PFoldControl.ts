import { IDisposable } from '@babylonjs/core';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { Behavior } from '../behavior';

export class BehaviorPFoldControl extends Behavior<MechanismParallel> implements IDisposable {
  protected mechanism: MechanismParallel;
}
