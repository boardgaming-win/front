import Layout from "@/layout/default";
import { Color, GameHistoryDetail, Target } from "@/types";
import { Row } from "@nextui-org/react";
import Board from '@/components/board/gomoku';
import { useEffect, useState } from "react";
import { gomoku_api } from "@/config/apiConfig";
import { fileOf, foulMoves, makeMove, rankOf, registerWorker } from "@/functions/gomoku/asm";
import { GetServerSideProps } from "next";
import Header from "@/layout/header/gameRoom";
import Footer from "@/layout/footer/gameHistory";

const boardRows = 14;

export default function GomokuGameHistory({
    id
}: {
    id: number
}) {
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
    ))

    const [gameHistoryDetail, setGameHistoryDetail] = useState<GameHistoryDetail>();
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
    const [banMoves, setBanMoves] = useState<Array<Array<number>>>([]);

    async function setPositionByMoveStack(moveStack: Array<number>) {
        const newPosition = Array.from(
            {length: boardRows + 1},
            (): Array<Color> => Array.from(
                {length: boardRows + 1},
                (): Color => Color.HIDE
            )
        );

        const newTargetState = Array.from(
            {length: boardRows + 1},
            (): Array<Target> => Array.from(
                {length: boardRows + 1},
                (): Target => Target.HIDE
            )
        );

        moveStack.forEach((move, index) => {
            newPosition[rankOf(move)][fileOf(move)] = index % 2 == 0 ? Color.BLACK : Color.WHITE;

            if (index == moveStack.length - 1) {
                newTargetState[rankOf(move)][fileOf(move)] = Target.LAST;
            }
        });

        banMoves[moveStack.length - 1]?.forEach(move => {
            newPosition[rankOf(move)][fileOf(move)] = Color.BAN;
        });

        setPosition(newPosition);
        setTargetState(newTargetState);
    }

    async function calcBanMoves(moveStack: Array<number>) {
        const newBanMoves: Array<Array<number>> = [];
        for (let i = 0; i < moveStack.length; ++i) {
            if (i > 6 && i % 2 == 1) {
                newBanMoves.push((await foulMoves(moveStack.slice(0,i+1).map(move => [rankOf(move), fileOf(move)]))).map(rf => makeMove(rf[0], rf[1])));
            } else {
                newBanMoves.push([]);
            }
        }

        setBanMoves(newBanMoves);
    }

    async function updateGameHistoryDetail(id: number) {
        const { data } = await gomoku_api.get(`/api/gameHistory/${id}`);

        calcBanMoves(data.moveStack);
        setCurrentMoveIndex(1);
        setGameHistoryDetail(data);
    }

    useEffect(() => {
        gameHistoryDetail?.moveStack && setPositionByMoveStack(gameHistoryDetail?.moveStack.slice(0, currentMoveIndex));
    }, [currentMoveIndex, gameHistoryDetail]);

    useEffect(() => {
        registerWorker(new Worker("/js/gomoku/gomoku_worker.js"));
        updateGameHistoryDetail(id);
    }, []);

    return (
        <Layout
            header={<Header outUrl={"/gomoku/online"}/>}
            footer={<Footer gameHistoryDetail={gameHistoryDetail} currentMoveIndex={currentMoveIndex} setCurrentMoveIndex={setCurrentMoveIndex}/>}>
            <Row justify="center">
                <Board
                    boardRows={boardRows}
                    position={position}
                    targetState={targetState} />
            </Row>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context;
    const { id } = query;
    return {
      props: {
        id,
      },
    };
};