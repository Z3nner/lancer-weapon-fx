import {getMessageInfo} from "./messageParser.js";

class ModuleApi {
    static getEffectVolume(volume) {
        return volume * game.settings.get("lancer-weapon-fx", "volume");
    }

    static getMacroVariables(messageId, actor) {
        const message = game.messages.get(messageId);
        const sourceTokenFallback = canvas.tokens.controlled[0] ?? game.combat?.current?.tokenId;
        const targetsFallback = [...game.user.targets];

        if (!message) {
            return {
                sourceToken: sourceTokenFallback,
                targetTokens: targetsFallback,
                targetsMissed: game.settings.get("lancer-weapon-fx", "debug-is-default-miss")
                    ? new Set(targetsFallback.map(target => target.id))
                    : new Set(),
            };
        }

        const {sourceToken, targetTokens, targetsMissed} = getMessageInfo(message);
        return {
            sourceToken: sourceToken || sourceTokenFallback,
            targetTokens: targetTokens || targetsFallback,
            targetsMissed,
        };
    }

    static euclideanDistance = function(point1, point2) {
        // Calculate the Euclidean distance between two points.
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static assignToClusters = function(points, centroids) {
        const clusters = new Array(centroids.length).fill(null).map(() => []);

        for (const point of points) {
            const distances = centroids.map(centroid => this.euclideanDistance(point, centroid));
            const clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(point);
        }

        return clusters;
    }

    static calculateCentroids = function(cluster) {
        // Calculate the centroid (mean) of a cluster of points.
        if (cluster.length === 0) {
          return null;
        }

        const sumX = cluster.reduce((sum, point) => sum + point.x, 0);
        const sumY = cluster.reduce((sum, point) => sum + point.y, 0);

        return { x: sumX / cluster.length, y: sumY / cluster.length };
    };

    static lloydsAlgorithm = function(points, numCentroids) {
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
          const clusters = this.assignToClusters(points, centroids);

          // Calculate new centroids based on the current cluster assignments.
          centroids.forEach((_, i) => {
            centroids[i] = this.calculateCentroids(clusters[i]);
          });
        }

        return centroids;
    };

    static getTargetLocationsFromTokenGroup(targetTokens, numGroups) {
        const targetPoints = targetTokens.map(token => {
            return {x: token.center.x, y: token.center.y};
        });

        return this.lloydsAlgorithm(targetPoints, numGroups);
    }
}

Hooks.on("init", () => game.modules.get("lancer-weapon-fx").api = ModuleApi);
