import { euclideanDistance, fisherYatesShuffle, getUniquePoints } from "./utils.js";

export default class LloydsAlgorithm {
    static _assignToClusters(points, centroids) {
        const clusters = Array.from(centroids, () => []);

        for (const point of points) {
            const distances = centroids.map(centroid => euclideanDistance(point, centroid));
            const clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(point);
        }

        return clusters;
    }

    static _calculateCentroids(cluster) {
        // Calculate the centroid (mean) of a cluster of points.
        if (cluster.length === 0) {
            return null;
        }

        const sumX = cluster.reduce((sum, point) => sum + point.x, 0);
        const sumY = cluster.reduce((sum, point) => sum + point.y, 0);

        return { x: sumX / cluster.length, y: sumY / cluster.length };
    }

    static getCentroids(points, numCentroids) {
        if (numCentroids <= 0) {
            return [];
        }

        // If we request more centroids than there are points, each point must be its own centroid
        if (points.length <= numCentroids) {
            return points;
        }

        // Initialize random centroids to start the algorithm.
        // Ensure each seed centroid is unique.
        const uniquePoints = getUniquePoints(points);
        const centroids = fisherYatesShuffle(uniquePoints.slice()).slice(0, numCentroids);
        if (centroids.length < numCentroids) {
            // If there are insufficiently many unique seed points, generate more points by adding an increasing offset
            //   to the biggest X and Y values from all points.
            const maxX = Math.max(...uniquePoints.map(({ x }) => x));
            const maxY = Math.max(...uniquePoints.map(({ y }) => y));

            for (let i = centroids.length; i < numCentroids; ++i) {
                centroids.push({ x: maxX + i, y: maxY + i });
            }
        }

        let previousCentroids;
        while (
            !previousCentroids ||
            !centroids.every(
                (centroid, i) => centroid.x === previousCentroids[i].x && centroid.y === previousCentroids[i].y,
            )
        ) {
            previousCentroids = centroids.slice();

            // Assign points to clusters based on the current centroids.
            const clusters = this._assignToClusters(points, centroids);

            // Calculate new centroids based on the current cluster assignments.
            centroids.forEach((_, i) => {
                centroids[i] = this._calculateCentroids(clusters[i]);
            });
        }

        return centroids;
    }
}
