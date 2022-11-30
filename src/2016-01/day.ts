import {A, pipe, S} from '@mobily/ts-belt';
import {exhaustiveCheck, loadRawInput, makeDeepWritable} from '../util';

type Direction = 'north' | 'east' | 'south' | 'west';

type Coordinate = {
    x: number;
    y: number;
};

type Location = {
    direction: Direction;
    location: Coordinate;
};

type Turn = 'left' | 'right';

type Instruction = {
    turn: Turn;
    distance: number;
};

const turn = (direction: Direction, turn: Turn): Direction => {
    const combination = `${direction}_${turn}` as const;

    switch (combination) {
        case 'north_left':
            return 'west';
        case 'north_right':
            return 'east';
        case 'east_left':
            return 'north';
        case 'east_right':
            return 'south';
        case 'south_left':
            return 'east';
        case 'south_right':
            return 'west';
        case 'west_left':
            return 'south';
        case 'west_right':
            return 'north';
        default:
            exhaustiveCheck(combination);
            throw Error('Unreachable');
    }
};

const walk = (location: Location, distance: number): Coordinate => {
    switch (location.direction) {
        case 'north': {
            return {
                x: location.location.x,
                y: location.location.y + distance,
            };
        }
        case 'east': {
            return {
                x: location.location.x + distance,
                y: location.location.y,
            };
        }
        case 'south': {
            return {
                x: location.location.x,
                y: location.location.y - distance,
            };
        }
        case 'west': {
            return {
                x: location.location.x - distance,
                y: location.location.y,
            };
        }
        default:
            exhaustiveCheck(location.direction);
            throw Error('Unreachable');
    }
};

export const part1 = (instructions: Instruction[]) => {
    return pipe(
        instructions,
        A.reduce(
            {
                direction: 'north' as Direction,
                location: {x: 0, y: 0},
            },
            (current, instruction) => {
                return pipe(
                    current,
                    // First we turn,
                    current => {
                        return {
                            direction: turn(
                                current.direction,
                                instruction.turn,
                            ),
                            location: current.location,
                        };
                    },
                    // Then we walk
                    current => {
                        return {
                            direction: current.direction,
                            location: walk(current, instruction.distance),
                        };
                    },
                );
            },
        ),
        ({location}) => {
            return Math.abs(location.x) + Math.abs(location.y);
        },
    );
};

export const parse = (input: string) => {
    return pipe(
        input,
        S.split(','),
        A.map((instruction: string) =>
            pipe(instruction, S.trim, S.splitAt(1), ([turn, distance]) => {
                return {
                    turn: turn === 'R' ? ('right' as const) : ('left' as const),
                    distance: Number(distance),
                };
            }),
        ),
        makeDeepWritable,
    );
};

export const run = () => {
    const input = pipe(loadRawInput('2016-01'), parse);

    console.log('Part 1:', part1(input));
};
