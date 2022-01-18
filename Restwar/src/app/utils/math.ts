/**
 * Converts an angle in radians to degree
 *
 * @param rad angle in radians
 * @returns angle in degree
 */
export function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * converts an angle in degree to radians
 *
 * @param deg angle in degree
 * @returns angle in radians
 */
export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * If an angle reaches a certain distance to a snapping step, it gets
 * rounded directly to this snapping step.
 *
 * E.g. snappingstep = 90, snapAngle = 5
 * If angle is 184, it gets "rounded" to 180
 *
 * @param angle angle to be evaluated
 * @param snapAngle distance to the next snapping angle for which rounding should be applied
 * @param snappingSteps steps, in which snapping should be applied
 */
export function snapDegree(angle: number, snapAngle: number, snappingSteps: number): number {
  if (Math.abs(snappingSteps / 2 - Math.abs((angle % snappingSteps) - snappingSteps / 2)) < snapAngle) {
    angle = Math.round(angle / snappingSteps) * snappingSteps;
  }
  return angle;
}
