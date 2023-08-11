import { GomokuGameStatus, GomokuGameTurn, RoomDetail, User } from "@/types";
import css from './gameRoom.module.css';
import { ReactElement, useEffect, useState } from "react";
import { Col, Row } from "@nextui-org/react";
import Timer from "@/components/controller/timer";
import UserGameInfo from "@/components/controller/userGameInfo";
import PutButton from "@/components/controller/putButton";

export default function Footer({
    roomDetail,
    putPress,
    onTurnTimeEnd,
    user
}: {
    roomDetail: RoomDetail,
    putPress: () => void,
    onTurnTimeEnd: () => void,
    user: User
}): ReactElement {
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
                <Col span={5.1} css={{ height: "100%" }}>
                    <UserGameInfo
                        isTurn={roomDetail.gameTurn == GomokuGameTurn.BLACK && roomDetail.blackPlayer?.id == user.id && roomDetail.gameStatus == GomokuGameStatus.START}
                        user={roomDetail.blackPlayer}
                        gameUserHistory={roomDetail.blackGameUserHistory}
                        reversed={false}
                        color={GomokuGameTurn.BLACK}
                        imageSpan={3}/>
                </Col>
                <Col span={1.8} css={{ height: "100%", justifyContent: "center", display: "flex" }}>
                    <PutButton onPress={putPress}></PutButton>
                </Col>
                <Col span={5.1} css={{ height: "100%" }}>
                    <UserGameInfo
                        isTurn={roomDetail.gameTurn == GomokuGameTurn.WHITE && roomDetail.whitePlayer?.id == user.id && roomDetail.gameStatus == GomokuGameStatus.START}
                        user={roomDetail.whitePlayer}
                        gameUserHistory={roomDetail.whiteGameUserHistory}
                        reversed={true}
                        color={GomokuGameTurn.WHITE}
                        imageSpan={3}/>
                </Col>
            </Row>
        </div>
    );
}