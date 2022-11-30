import {A, pipe} from '@mobily/ts-belt';
import {loadInput, makeDeepWritable} from '../util';

type Direction = 'U' | 'R' | 'D' | 'L';

type Line = Direction[];

type Input = Line[];

const grid1 = [
    [0, 0, 0, 0, 0],
    [0, 1, 2, 3, 0],
    [0, 4, 5, 6, 0],
    [0, 7, 8, 9, 0],
    [0, 0, 0, 0, 0],
];

const a = 'A';
const b = 'B';
const c = 'C';
const d = 'D';

const grid2 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 2, 3, 4, 0, 0],
    [0, 5, 6, 7, 8, 9, 0],
    [0, 0, a, b, c, 0, 0],
    [0, 0, 0, d, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

const move = (direction: Direction, x: number, y: number) => {
    switch (direction) {
        case 'U':
            return {
                x,
                y: y - 1,
            };
        case 'R':
            return {
                x: x + 1,
                y,
            };
        case 'D':
            return {
                x,
                y: y + 1,
            };
        case 'L':
            return {
                x: x - 1,
                y,
            };
    }
};

const moveInGrid = (
    direction: Direction,
    x: number,
    y: number,
    grid: any[][],
) => {
    const moved = move(direction, x, y);

    if (grid[moved.y]?.[moved.x] === 0) {
        return {x, y};
    } else {
        return moved;
    }
};

const calculate = (
    input: Input,
    grid: any[][],
    startX: number,
    startY: number,
) => {
    return pipe(
        input,
        A.reduce({x: startX, y: startY, code: ''}, ({x, y, code}, line) => {
            return pipe(
                line,
                A.reduce({x, y}, ({x, y}, direction) => {
                    return moveInGrid(direction, x, y, grid);
                }),
                ({x, y}) => ({x, y, code: `${code}${grid[y][x]}`}),
            );
        }),
        ({code}) => code,
    );
};

const part1 = (input: Input) => {
    return calculate(input, grid1, 2, 2);
};

const part2 = (input: Input) => {
    return calculate(input, grid2, 2, 4);
};

const parse = (): Input => {
    return makeDeepWritable(loadInput('2016-02')) as unknown as Input;
};

export const run = () => {
    const input = parse();

    console.log(part1(input));
    console.log(part2(input));
};
