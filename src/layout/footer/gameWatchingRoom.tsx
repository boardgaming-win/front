import { Col, Row } from '@nextui-org/react';
import css from './gameWatchingRoom.module.css';
import Timer from '@/components/controller/timer';
import UserGameInfo from '@/components/controller/userGameInfo';
import { GomokuGameStatus, GomokuGameTurn, RoomDetail } from '@/types';
import { useEffect, useState } from 'react';

export default function Footer({
    roomDetail,
    onTurnTimeEnd
}: {
    roomDetail: RoomDetail,
    onTurnTimeEnd: () => void
}) {
    const [turnTimeEnd, setTurnTimeEnd] = useState(0);
    const [turnTime, setTurnTime] = useState(0);

    useEffect(() => {
        setTimeout(async () => {
            const newTurnTime: number = Math.max((turnTimeEnd - Date.now()) / 1000, 0);

            if (turnTime > 0) {
                if (newTurnTime == 0) {
                    onTurnTimeEnd();
                }
                setTurnTime(newTurnTime);
            }
        }, 100);
    }, [turnTime]);

    useEffect(() => {
        switch (roomDetail.gameStatus) {
            case GomokuGameStatus.START:
                setTurnTimeEnd(Date.now() + roomDetail.turnTimeLeft)
                setTurnTime(roomDetail.turnTimeLeft / 1000);
                break;
            default: break;
        }
    }, [roomDetail]);

    return (
        <div className={css.footer}>
            <Row className={css.timer}>
                <Timer progress={turnTime / roomDetail.turnTime * 100}></Timer>
            </Row>
            <Row className={css.userInfo}>
                <Col span={6} css={{ height: "100%" }}>
                    <UserGameInfo
                        isTurn={roomDetail.gameTurn == GomokuGameTurn.BLACK && roomDetail.gameStatus == GomokuGameStatus.START}
                        user={roomDetail.blackPlayer}
                        gameUserHistory={roomDetail.blackGameUserHistory}
                        reversed={false}
                        color={GomokuGameTurn.BLACK}
                        imageSpan={4}/>
                </Col>
                <Col span={6} css={{ height: "100%" }}>
                    <UserGameInfo
                        isTurn={roomDetail.gameTurn == GomokuGameTurn.WHITE && roomDetail.gameStatus == GomokuGameStatus.START}
                        user={roomDetail.whitePlayer}
                        gameUserHistory={roomDetail.whiteGameUserHistory}
                        reversed={true}
                        color={GomokuGameTurn.WHITE}
                        imageSpan={4}/>
                </Col>
            </Row>
        </div>
    );
}