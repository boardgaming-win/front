import { useState } from "react";
import css from './index.module.css';
import Board from '../../../components/board/gomoku';
import { Modal, Text, Input, Grid, Row } from '@nextui-org/react';
import { Color, Target, WinState } from '../../../types';
import { checkAlreadyWin, thinkAndMove, registerWorker, foulMoves } from '../../../functions/gomoku/asm';
import { useEffect } from "react";
import Layout from "@/layout/gomoku/ai/gameRoom";
import Swal from "sweetalert2";
import { boardRows } from "@/config/board";

let moveStack: Array<Array<number>> = [];
let playerSide: Color = Color.HIDE;
let currentTarget: Array<number> = [NaN, NaN];
let turn: Color = Color.BLACK;
const soloPlay: boolean = false;
let position: Array<Array<Color>> = Array.from(
    {length: boardRows + 1},
    (): Array<Color> => Array.from(
        {length: boardRows + 1},
        (): Color => Color.HIDE
    )
);

export default function GomokuAI() {
    const [settingVisible, setSettingVisible] = useState(false);
    const [turnSettingVisible, setTurnSettingVisible] = useState(true);
    const [timeLimit, setTimeLimit] = useState("20");

    const [targetState, setTargetState] = useState(Array.from(
        {length: boardRows + 1},
        (): Array<Target> => Array.from(
            {length: boardRows + 1},
            (): Target => Target.HIDE
        )
    ));

    function changeTargetState(rank: number, file: number, value: Target): void {
        const targetStateCopy = [...targetState];
        targetStateCopy[rank][file] = value;
        setTargetState(targetStateCopy);
    };

    function targetClear(targetTypes: Target[]): void {
        const targetStateCopy = [...targetState];
        for (let rank = 0; rank < boardRows + 1; rank++) {
            for (let file = 0; file < boardRows + 1; file++) {
                if (targetTypes.includes(targetStateCopy[rank][file])) {
                    targetStateCopy[rank][file] = Target.HIDE;
                }
            }
        }
        setTargetState(targetStateCopy);
    };

    //playState

    const [winState, setWinState] = useState<WinState>(WinState.NONE);

    function checkGameEnd(ws: number) {
        if (ws != 0) {
            switch (ws) {
                case 1: {
                    setWinState(WinState.BLACK);
                    setTimeout(() => {
                        Swal.fire({
                            icon: "info",
                            title: "Game End",
                            text: "Black Win!"
                        });
                    }, 200);
                    break;
                }
                case 2: {
                    setWinState(WinState.WHITE);
                    setTimeout(() => {
                        Swal.fire({
                            icon: "info",
                            title: "Game End",
                            text: "White Win!"
                        });
                    }, 200);
                    break;
                }
                case 3: {
                    setWinState(WinState.DRAW);
                    setTimeout(() => {
                        Swal.fire({
                            icon: "info",
                            title: "Game End",
                            text: "Draw!"
                        });
                    }, 200);
                    break;
                }
            }
        }
    }
    
    function changeTurn() {
        if (turn == Color.BLACK) {
            turn = Color.WHITE;
        } else {
            turn = Color.BLACK;
        }
    }

    useEffect(() => {
        registerWorker(new Worker("/js/gomoku/gomoku_worker.js"));
    }, []);


    function updateTargetLast(rank: number, file: number): void {
        targetClear([Target.LAST]);
    
        changeTargetState(rank, file, Target.LAST);
    }

    function findEmptyTarget(): number[] {
        for (let i = 0; i < boardRows + 1; i++) {
            for (let j = 0; j < boardRows + 1; j++) {
                if (!moveStack.includes([i, j])) {
                    return [i, j];
                }
            }
        }

        return [];
    };

    async function requestAINewPosition(): Promise<void> {
        try{
			let target: number[] = await thinkAndMove(moveStack, Number(timeLimit));

            if (target[0] < 0 || target[1] < 0) {
                target = findEmptyTarget();   
            }

            targetClick(target[0], target[1], true);
            await putClick(true);
		} catch (err: any) {
            console.log(err);
		}
    }

    async function undoClick(byAI: boolean = soloPlay): Promise<void> {
        if (playerSide == Color.HIDE) {
            Swal.fire({
                icon: "warning",
                title: "Undo Click",
                text: "Undo is not possible until the game starts"
            });
            return;
        } else if (turn != playerSide && !byAI) {
            Swal.fire({
                icon: "warning",
                title: "Undo Click",
                text: "Undo is not possible until AI's turn is over."
            });
            return;
        }

        if (moveStack.length < 2) {
            resetClick();
        } else {
            moveStack.pop();
            moveStack.pop();
            const new_position = await convertMoveStackToPosition(moveStack);
            updatePosition(new_position);

            updateTargetLast(moveStack[moveStack.length - 1][0], moveStack[moveStack.length - 1][1]);
            setWinState(WinState.NONE);
        }
    }

    async function putClick(byAI: boolean = soloPlay): Promise<void> {
        if (playerSide == Color.HIDE) {
            setTurnSettingVisible(true);
            return;
        }

        if (winState != WinState.NONE
            || (turn != playerSide && !byAI)) {
            return;
        }

        if (!Number.isNaN(currentTarget[0])) {
            const [rank, file] = currentTarget;

            currentTarget[0] = NaN;
            currentTarget[1] = NaN;

            moveStack.push([rank, file]);

            const new_position = await convertMoveStackToPosition(moveStack);
            updatePosition(new_position);

            updateTargetLast(rank, file);

            checkGameEnd(await checkAlreadyWin(moveStack));

            changeTurn();
            if (turn != playerSide && !byAI) {
                await requestAINewPosition();
            }
        }
    }

    async function resetClick(byAI: boolean = soloPlay): Promise<void> {
        if (playerSide == Color.HIDE) {
            Swal.fire({
                icon: "warning",
                title: "Reset Click",
                text: "Reset is not possible until the game starts."
            });
            return;
        } else if (turn != playerSide && !byAI) {
            Swal.fire({
                icon: "warning",
                title: "Reset Click",
                text: "Reset is not possible until AI's turn is over."
            });
            return;
        }
        moveStack = [];
        const new_position = await convertMoveStackToPosition(moveStack);
        updatePosition(new_position);

        playerSide = Color.HIDE;
        currentTarget = [NaN, NaN];
        turn = Color.BLACK;
        targetClear([Target.LAST, Target.SELECT]);
        setWinState(WinState.NONE);
    }

    const [positionState, setPositionState] = useState(Array.from(
        {length: boardRows + 1},
        (): Array<Color> => Array.from(
            {length: boardRows + 1},
            (): Color => Color.HIDE
        )
    ));

    function updatePosition(new_position: Array<Array<Color>>) {
        setPositionState(new_position);
        position = new_position;
    }

    async function convertMoveStackToPosition(moveStack: Array<Array<number>>) {
        const new_position = Array.from(
            {length: boardRows + 1},
            (): Array<Color> => Array.from(
                {length: boardRows + 1},
                (): Color => Color.HIDE
            )
        );
        moveStack.forEach((move, index) => {
            new_position[move[0]][move[1]] = index % 2 == 0 ? Color.BLACK : Color.WHITE;
        });
    
        if (moveStack.length % 2 == 0) {
            const foul_moves = await foulMoves(moveStack);

            foul_moves.forEach(move => {
                new_position[move[0]][move[1]] = Color.BAN;
            });
        }

        return new_position;
    }

    function onSelectBlack() {
        setTurnSettingVisible(false);
        playerSide = Color.BLACK;
    }

    async function onSelectWhite() {
        setTurnSettingVisible(false);
        playerSide = Color.WHITE;
        targetClick(7,7,true);
        await putClick(true);
    }

    function targetClick(rank: number, file: number, byAI: boolean = soloPlay) {
        if (playerSide == Color.HIDE) {
            setTurnSettingVisible(true);
            return;
        }
    
        if (position[rank][file] != Color.HIDE) {
            throw new Error(`[targetClick] (${rank}, ${file}) Not Empty position ${JSON.stringify(moveStack)} ${JSON.stringify(position.map(row=>row.map(col=>{
                switch(col) {
                    case Color.BAN: return 3;
                    case Color.BLACK: return 1;
                    case Color.WHITE: return 2;
                    case Color.HIDE: return 0;
                }
            })))}`);
        }
        
        if (winState != WinState.NONE) {
            Swal.fire({
                icon: "info",
                title: "target click",
                text: "Game end"
            });
            return;
        }
    
        if (turn != playerSide && !byAI) {
            Swal.fire({
                icon: "info",
                title: "target click",
                text: "Not your turn"
            });
            return;
        }
    
        targetClear([Target.SELECT]);
    
        changeTargetState(rank, file, Target.SELECT);
        
        currentTarget[0] = rank;
        currentTarget[1] = file;
    }

    return (
        <Layout
            setSettingVisible={setSettingVisible}
            undoClick={() => undoClick()}
            putClick={() => putClick()}
            resetClick={() => resetClick()}>
            <>
                <Modal
                    closeButton
                    preventClose
                    aria-labelledby="modal-title"
                    open={turnSettingVisible}
                    width="788px"
                    onClose={()=>setTurnSettingVisible(false)}>
                    <Modal.Header>
                        <Text id="modal-title" css={{ fontSize: "2vh" }}>
                            Select Color
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid.Container justify="center">
                            <Grid xs={6}>
                                <div className={`${css.square2x} ${css.center}`}
                                    onClick={onSelectBlack}>
                                    <div className={`${css.stone2x} ${css.center} ${css.black}`} />
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className={`${css.square2x} ${css.center}`}
                                    onClick={onSelectWhite}>
                                    <div className={`${css.stone2x} ${css.center} ${css.white}`} />
                                </div>
                            </Grid>
                        </Grid.Container>
                    </Modal.Body>
                </Modal>
                <Modal
                    width="788px"
                    closeButton
                    preventClose
                    aria-labelledby="modal-title"
                    open={settingVisible}
                    onClose={()=>setSettingVisible(false)}>
                    <Modal.Header>
                        <Text id="modal-title" css={{ fontSize: "2em" }}>
                            Settings
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Input
                            size="xl"
                            label="TimeLimit(s)" 
                            type="number"
                            initialValue={timeLimit}
                            onChange={(e)=>setTimeLimit(e.target.value)} />
                    </Modal.Body>
                </Modal>
                <Row justify="center">
                    <Board
                        targetClick={targetClick}
                        boardRows={boardRows}
                        position={positionState}
                        targetState={targetState} />
                </Row>
            </>
        </Layout>
    )
}
