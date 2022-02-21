/*
  List of helper functions in order to manage projections
*/
import { COLOR_STROKE } from 'src/app/materials/material-service';
import { Path } from 'paper';

/**
 * Creates and returns a path for a rectangle with
 * an open side (folding side)
 * @param points List of four points
 * @returns path with a rectangle
 */
export function createPathRectangleOpen(points: paper.Point[]): paper.Path {
  const result = new Path({
    strokeColor: COLOR_STROKE,
    fillColor: null,
  });
  points.forEach((point) => result.add(point));

  return result;
}
