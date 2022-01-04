/**
 * Converts an angle in radians to degree
 *
 * @param rad angle in radians
 * @returns angle in degree
 */
export function rad2deg(rad: number) {
  return (rad * 180) / Math.PI;
}

/**
 * converts an angle in degree to radians
 *
 * @param deg angle in degree
 * @returns angle in radians
 */
export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
