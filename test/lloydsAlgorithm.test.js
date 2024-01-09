import {expect, jest, test} from '@jest/globals';
import LloydsAlgorithm from "../scripts/lloydsAlgorithm.js";

beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
})

test(
    "that the algorithm runs with 0 points",
    () => {
        expect(LloydsAlgorithm.getCentroids([], 2)).toStrictEqual([])
    },
);

test(
    "that the algorithm runs with points less than the number of clusters",
    () => {
        expect(LloydsAlgorithm.getCentroids([{x: 1, y: 1}], 2)).toStrictEqual([{x: 1, y: 1}])
    },
);

test(
    "that the algorithm runs with duplicate points",
    () => {
        expect(
            LloydsAlgorithm.getCentroids(
                [
                    {x: 1, y: 1},
                    {x: 1, y: 1},
                ],
                2
            )
        ).toStrictEqual([
            {x: 1, y: 1},
            {x: 1, y: 1},
        ])
    },
);

test(
    "that the algorithm runs with the same number of points as clusters",
    () => {
        expect(
            LloydsAlgorithm.getCentroids(
                [
                    {x: 0, y: 0},
                    {x: 1, y: 1},
                ],
                2
            )
        ).toStrictEqual([
            {x: 0, y: 0},
            {x: 1, y: 1},
        ])
    },
);

test(
    "that the algorithm runs with the same number of points as clusters",
    () => {
        expect(
            LloydsAlgorithm.getCentroids(
                [
                    {x: -1, y: -1},
                    {x: -1, y: 1},
                    {x: 1, y: -1},
                    {x: 1, y: 1},
                ],
                2
            )
        ).toStrictEqual([
            // Equal distance to each cluster has a bias in one direction due to use of
            // `distances.indexOf(Math.min(...distances))`
            // This is ok as it prevents infinite loops and is not common in practice
            {x: -1/3, y: -1/3},
            {x: 1, y: 1},
        ])
    },
);
