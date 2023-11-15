const {targetsMissed, targetTokens, sourceToken} = game.modules.get("lancer-weapon-fx").api.getMacroVariables(typeof messageId === "undefined" ? null : messageId, actor);

const euclideanDistance = (point1, point2) => {
    // Calculate the Euclidean distance between two points.
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

const assignToClusters = (points, centroids) => {
    const clusters = new Array(centroids.length).fill(null).map(() => []);

    for (const point of points) {
        const distances = centroids.map(centroid => euclideanDistance(point, centroid));
        const clusterIndex = distances.indexOf(Math.min(...distances));
        clusters[clusterIndex].push(point);
    }

    return clusters;
};

const calculateCentroids = (cluster) => {
    // Calculate the centroid (mean) of a cluster of points.
    if (cluster.length === 0) {
      return null;
    }

    const sumX = cluster.reduce((sum, point) => sum + point.x, 0);
    const sumY = cluster.reduce((sum, point) => sum + point.y, 0);

    return { x: sumX / cluster.length, y: sumY / cluster.length };
};

const lloydsAlgorithm = (points, numCentroids) => {
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
      const clusters = assignToClusters(points, centroids);

      // Calculate new centroids based on the current cluster assignments.
      centroids.forEach((_, i) => {
        centroids[i] = calculateCentroids(clusters[i]);
      });
    }

    return centroids;
};

// extract target positions into x/y pairs
const targetPoints = targetTokens.map(token => {
    return {x: token.center.x, y: token.center.y};
});

// Split all targets into 2 groups and find the center points (centroids) of each group
// Pinaka wants 2 missiles, so get 2 centroids
const centroids = lloydsAlgorithm(targetPoints, 2);

let sequence = new Sequence();

for (const targetPoint of centroids) {
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Launch.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Travel.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5))
        .timeRange(700, 2000);
    sequence.effect()
        .file("jb2a.throwable.launch.missile")
        .atLocation(sourceToken)
        .stretchTo(targetPoint)
        .waitUntilFinished();
    sequence.sound()
        .file("modules/lancer-weapon-fx/soundfx/Missile_Impact.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.5));
    sequence.effect()
        .file("jb2a.explosion.01.orange")
        .atLocation(targetPoint)
        .scale(1.2)
        .zIndex(2);
    sequence.effect()
        .file("jb2a.explosion.08.orange")
        .atLocation(targetPoint)
        .scale(1.2)
        .zIndex(1);
}
sequence.play();