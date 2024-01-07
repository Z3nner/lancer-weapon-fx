import {euclideanDistance} from "./utils.js";

export default class LloydsAlgorithm {
    static _assignToClusters (points, centroids) {
        const clusters = Array.from(centroids, () => []);

        for (const point of points) {
            const distances = centroids.map(centroid => euclideanDistance(point, centroid));
            const clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(point);
        }

        return clusters;
    }

    static _calculateCentroids (cluster) {
        // Calculate the centroid (mean) of a cluster of points.
        if (cluster.length === 0) {
            return null;
        }

        const sumX = cluster.reduce((sum, point) => sum + point.x, 0);
        const sumY = cluster.reduce((sum, point) => sum + point.y, 0);

        return { x: sumX / cluster.length, y: sumY / cluster.length };
    }

    static getCentroids (points, numCentroids) {
        if (numCentroids <= 0) {
            return [];
        }

        // Initialize random centroids to start the algorithm.
        const centroids = [];
        for (let i = 0; i < numCentroids; i++) {
            centroids.push(points[Math.floor(Math.random() * points.length)]);
        }

        let previousCentroids;
        while (
            !previousCentroids ||
            !centroids.every((centroid, i) =>
                centroid.x === previousCentroids[i].x && centroid.y === previousCentroids[i].y
            )
            ) {
            previousCentroids = centroids.map(centroid => ({ ...centroid }));

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
