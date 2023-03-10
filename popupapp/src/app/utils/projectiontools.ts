/*
  List of helper functions in order to manage projections
*/
import { Point, Path, Group } from 'paper';

/**
 * Creates and returns a path for a rectangle with
 * an open side (folding side)
 * @param points List of four points
 * @returns path with a rectangle
 */
export function createPathRectangleOpen(points: paper.Point[]): paper.Path {
  const result = new Path({
    strokeColor: 'black',
    fillColor: null,
  });
  points.forEach((point) => result.add(point));

  return result;
}

/**
 * Updates the points of a rectangle path
 *
 * @param path to be updated
 * @param points that should be used for updating the path
 * @returns the new version of the path
 */
export function updatePathRectangleOpen(path: paper.Path, points: paper.Point[]): paper.Path {
  path.segments.forEach((segment, index) => (segment.point = points[index]));
  return path;
}

/**
 * Make sub items are true children of the parent group by deactivating
 * direct application of the transform matrix
 * @param group
 */
export function makeMatrixInheritable(group: paper.Group) {
  group.applyMatrix = false;
  group.children.forEach((item) => (item.applyMatrix = false));
}

/**
 * creates a default group that behaves according to
 * the classical matrix-parenting rules
 */
export function getDefaultGroup(): paper.Group {
  let result = new Group();
  result.applyMatrix = false;
  result.pivot = new Point(0, 0);
  return result;
}
