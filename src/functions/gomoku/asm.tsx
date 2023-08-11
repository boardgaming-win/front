const BOARD_BOUNDARY: number = 4;
const BOARD_SIDE_BIT: number = 5;

function makeMove(rank: number, file: number): number {
    return ((rank + BOARD_BOUNDARY) << BOARD_SIDE_BIT) + file + BOARD_BOUNDARY;
};

function rankOf(move: number): number {
    return (move >> BOARD_SIDE_BIT) - BOARD_BOUNDARY;
}

function fileOf(move: number): number {
    return (move & ((1 << BOARD_SIDE_BIT) - 1)) - BOARD_BOUNDARY;
}

function thinkAndMove(moveStack: Array<Array<number>>, tl: number): Promise<Array<number>> {
    const asmMoveStack: Array<number> = moveStack.map(val => makeMove(val[0], val[1]));

    return new Promise((resolve, reject) => {
        myWorker.onmessage = message => {
            const response: number = message.data;

            resolve([rankOf(response), fileOf(response)]);
        }
        myWorker.postMessage(JSON.stringify({
            func_name: 'think_and_move',
            args: {
                asmMoveStack: asmMoveStack,
                tl: tl
            }
        }));
    });
};

function foulMoves(moveStack: Array<Array<number>>): Promise<Array<Array<number>>> {
    const asmMoveStack: Array<number> = moveStack.map(val => makeMove(val[0], val[1]));

    return new Promise((resolve, reject) => {
        myWorker.onmessage = message => {
            const response: Array<number> = message.data;
            resolve(response.map(move => [rankOf(move), fileOf(move)]));
        }
        myWorker.postMessage(JSON.stringify({
            func_name: 'foul_moves',
            args: {
                asmMoveStack: asmMoveStack
            }
        }));
    });
}

function checkAlreadyWin(moveStack: Array<Array<number>>): Promise<number> {
    const asmMoveStack: Array<number> = moveStack.map(val => makeMove(val[0], val[1]));

    return new Promise((resolve, reject) => {
        myWorker.onmessage = message => resolve(message.data);
        myWorker.postMessage(JSON.stringify({
            func_name: 'check_wld_already',
            args: {
                asmMoveStack: asmMoveStack
            }
        }));
    });
}

let myWorker: Worker;

function registerWorker(worker: Worker): void {
    myWorker = worker;
    myWorker.postMessage("initialize");
}

export {
    checkAlreadyWin,
    foulMoves,
    thinkAndMove,
    registerWorker,
    makeMove,
    rankOf,
    fileOf
}