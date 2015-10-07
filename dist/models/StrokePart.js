import Point from './Point';
import { getExtremes } from '../utils';

class StrokePart {
  constructor(strokeType, points) {
    this._strokeType = strokeType;
    this._points = points;
  }

  getPoints() {
    return this._points;
  }

  getStrokeType() {
    return this._strokeType;
  }

  getBounds() {
    return Point.getBounds(this._points);
  }

  // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
  getDistance(point) {
    const start = this.getStartingPoint();
    const end = this.getEndingPoint();
    const dx = end.getX() - start.getX();
    const dy = end.getY() - start.getY();
    const length = this.getLength();
    return Math.abs(dy * point.getX() - dx * point.getY() - start.getX() * end.getY() + start.getY() * end.getX()) / length;
  }

  getAverageDistance(points) {
    let totalDist = 0;
    for (const point of points) {
      totalDist += this.getDistance(point);
    }
    return totalDist / points.length;
  }

  getLength() {
    const start = this.getStartingPoint();
    const end = this.getEndingPoint();
    return Math.sqrt(Math.pow(start.getX() - end.getX(), 2) + Math.pow(start.getY() - end.getY(), 2));
  }

  getStartingPoint() {
    return this.getExtremePoint(false);
  }

  getEndingPoint() {
    return this.getExtremePoint(true);
  }

  // where to start or end drawing the stroke based on the stroke type
  getExtremePoint(isReverse) {
    const strokeType = this.getStrokeType();
    const points = this.getPoints();
    let adjStrokeType = strokeType;
    let adjIsReverse = isReverse;
    const xs = points.map((point) => point.getX());
    const ys = points.map((point) => point.getY());
    const extremeXs = getExtremes(xs);
    const extremeYs = getExtremes(ys);

    // handle reversed strokes
    if (strokeType > StrokePart.FORWARD_SLASH_STROKE) {
      adjStrokeType = strokeType - StrokePart.FORWARD_SLASH_STROKE;
      adjIsReverse = !isReverse;
    }

    const minIndex = adjIsReverse ? 0 : 2;
    const maxIndex = adjIsReverse ? 2 : 0;
    const midIndex = 1;

    if (adjStrokeType === StrokePart.HORIZONTAL_STROKE) return new Point(extremeXs[minIndex], extremeYs[midIndex]);
    if (adjStrokeType === StrokePart.BACK_SLASH_STROKE) return new Point(extremeXs[minIndex], extremeYs[minIndex]);
    if (adjStrokeType === StrokePart.VERTICAL_STROKE) return new Point(extremeXs[midIndex], extremeYs[minIndex]);
    if (adjStrokeType === StrokePart.FORWARD_SLASH_STROKE) return new Point(extremeXs[maxIndex], extremeYs[minIndex]);
  }
}

StrokePart.HORIZONTAL_STROKE = 1;
StrokePart.BACK_SLASH_STROKE = 2;
StrokePart.VERTICAL_STROKE = 3;
StrokePart.FORWARD_SLASH_STROKE = 4;
StrokePart.REVERSE_HORIZONTAL_STROKE = 5;
StrokePart.REVERSE_BACK_SLASH_STROKE = 6;
StrokePart.REVERSE_VERTICAL_STROKE = 7;
StrokePart.REVERSE_FORWARD_SLASH_STROKE = 8;

export default StrokePart;