export function euclideanDistance(point1, point2) {
    // Calculate the Euclidean distance between two points.
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
