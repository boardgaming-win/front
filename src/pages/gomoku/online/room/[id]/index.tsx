import { gomoku_api } from "@/config/apiConfig";
import { gomoku_ws } from "@/config/socketConfig";
import whoami from "@/functions/serverProps/auth/whoami";
import Layout from "@/layout/default";
import { Color, GameType, GomokuGameStatus, GomokuGameTurn, GomokuRule, RoomDetail, Target, User } from "@/types";
import { Modal, Row } from "@nextui-org/react";
import { Frame } from "@stomp/stompjs";
import { GetServerSidePropsContext } from "next";
import Router from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Board from '@/components/board/gomoku';
import { fileOf, foulMoves, makeMove, rankOf, registerWorker } from "@/functions/gomoku/asm";
import Swal from "sweetalert2";
import GameResultForm from "@/components/gameResult/gameResultForm";
import { boardRows } from "@/config/board";
import Header from "@/layout/header/gameRoom";
import Footer from "@/layout/footer/gameRoom";

async function enterRoom(roomId: number, callback: (roomDetail: RoomDetail) => void) {
    try {
        const { data } = await gomoku_api.post(`/api/room/${roomId}/player`);
        
        if (data.valid) {
            callback(data.roomDetail);
        } else {
            Router.push(`/gomoku/online/room/${roomId}/watching`);
        }
    } catch (err) {
        Router.push("/gomoku/online");
    }
}

const subscribeList: string[] = [];
const currentTarget: {
    rank: number | null,
    file: number | null
} = {
    rank: null,
    file: null
};

export default function GomokuOnlineRoom({
    user,
    cookie
}: {
    user: User,
    cookie: string
}): ReactElement {
    useEffect(() => {
        const roomId = Number(Router.query.id);

        registerWorker(new Worker("/js/gomoku/gomoku_worker.js"));
        enterRoom(roomId, (roomDetail: RoomDetail) => {
            roomDetail && setRoomDetail(roomDetail);
            gomoku_ws.connect({}, () => {
                gomoku_ws.subscribe(`/sub/room/${roomDetail.id}`, (message: Frame) => {
                    setRoomDetail(JSON.parse(message.body));
                });
          
                subscribeList.push(`/sub/room/${roomDetail.id}`);
            });
        });

        return () => {
            subscribeList.forEach(subscribe => gomoku_ws.unsubscribe(subscribe));
            gomoku_ws.disconnect();
        }
    }, []);

    function onTurnTimeEnd() {
        gomoku_ws.send(`/pub/room/${Router.query.id}/player/end-check`, {
            Cookie: cookie
        });
    }

    const [roomDetail, setRoomDetail] = useState<RoomDetail>({
        id: Number(Router.query.id),
        rule: GomokuRule.RENJU,
        turnTime: 30,
        turnTimeLeft: 0,
        moveStack: [],
        gameStatus: GomokuGameStatus.WAITING,
        gameTurn: GomokuGameTurn.BLACK
    });

    async function updatePosition(
        gameRule: GomokuRule,
        moveStack: Array<number>
    ) {
        const newPosition = Array.from(
            {length: boardRows + 1},
            (): Array<Color> => Array.from(
                {length: boardRows + 1},
                (): Color => Color.HIDE
            )
        );
    
        const internalMoveStack = moveStack.map(move => [rankOf(move), fileOf(move)]);
    
        internalMoveStack.forEach((move, index) => {
            newPosition[move[0]][move[1]] = index % 2 == 0 ? Color.BLACK : Color.WHITE;
        });
    
        switch (gameRule) {
            case GomokuRule.RENJU:
                if (moveStack.length % 2 == 0) {
                    (await foulMoves(internalMoveStack)).forEach(move => {
                        newPosition[move[0]][move[1]] = Color.BAN;
                    });
                }
        }
        
        if (moveStack.length > 0) {
            const lastMove = moveStack[moveStack.length - 1];
            const targetStateCopy = [...targetState];

            for (let r = 0; r < boardRows + 1; r++) {
                for (let f = 0; f < boardRows + 1; f++) {
                    if (targetStateCopy[r][f] == Target.LAST) {
                        targetStateCopy[r][f] = Target.HIDE;
                    }
                }
            }

            targetStateCopy[rankOf(lastMove)][fileOf(lastMove)] = Target.LAST;
    
            setTargetState(targetStateCopy);
        }

        setPosition(newPosition);
    }

    useEffect(() => {
        switch (roomDetail.gameStatus) {
            case GomokuGameStatus.START:
                updatePosition(roomDetail.rule, roomDetail.moveStack);
                break;
            default: break;
        }
    }, [roomDetail]);

    const [position, setPosition] = useState(Array.from(
        {length: boardRows + 1},
        (): Array<Color> => Array.from(
            {length: boardRows + 1},
            (): Color => Color.HIDE
        )
    ));

    const [targetState, setTargetState] = useState(Array.from(
        {length: boardRows + 1},
        (): Array<Target> => Array.from(
            {length: boardRows + 1},
            (): Target => Target.HIDE
        )
    ));

    function targetClick(
        rank: number,
        file: number
    ) {
        if (!(roomDetail.gameTurn == GomokuGameTurn.BLACK && roomDetail.blackPlayer?.id == user.id) && !(roomDetail.gameTurn == GomokuGameTurn.WHITE && roomDetail.whitePlayer?.id == user.id)) {
            return;
        }

        const targetStateCopy = [...targetState];

        for (let r = 0; r < boardRows + 1; r++) {
            for (let f = 0; f < boardRows + 1; f++) {
                if (targetStateCopy[r][f] == Target.SELECT) {
                    targetStateCopy[r][f] = Target.HIDE;
                }
            }
        }

        targetStateCopy[rank][file] = Target.SELECT;

        setTargetState(targetStateCopy);
        
        currentTarget.rank = rank;
        currentTarget.file = file;
    };

    async function putPress() {
        if (!(roomDetail.gameTurn == GomokuGameTurn.BLACK && roomDetail.blackPlayer?.id == user.id) && !(roomDetail.gameTurn == GomokuGameTurn.WHITE && roomDetail.whitePlayer?.id == user.id)) {
            return;
        }

        if (!(currentTarget.rank && currentTarget.file)) {
            return;
        }

        if (position[currentTarget.rank][currentTarget.file] != Color.HIDE) {
            return;
        }

        try {
            gomoku_ws.send(`/pub/room/${Router.query.id}/player/put`, {
                Cookie: cookie
            }, JSON.stringify({
                move: makeMove(currentTarget.rank, currentTarget.file)
            }));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Put stone",
                text: `${error}`
            });
        }
    }

    return (
        <>
            <Modal
                open={roomDetail.gameStatus == GomokuGameStatus.END}
                onClose={() => Router.push("/gomoku/online")}
                width="500px">
                <Modal.Header css={{ fontSize: "2.5vh" }}>Game Result</Modal.Header>
                <Modal.Body>
                    <GameResultForm roomDetail={roomDetail}/>
                </Modal.Body>
            </Modal>
            <Layout header={<Header outUrl="/gomoku/online"/>} footer={<Footer user={user} roomDetail={roomDetail} putPress={putPress} onTurnTimeEnd={onTurnTimeEnd}/>}>
                <Row justify="center">
                    <Board
                        targetClick={targetClick}
                        boardRows={boardRows}
                        position={position}
                        targetState={targetState} />
                </Row>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, true, GameType.GOMOKU);
}
