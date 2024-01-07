export function euclideanDistance(point1, point2) {
    // Calculate the Euclidean distance between two points.
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Quickly shuffle an array in-place.
 */
export function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getUniquePoints(points) {
    const getPointId = point => `${point.x},${point.y}`;

    const seen = new Set();
    return points
        .filter(point => {
            const id = getPointId(point);
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
}
