import { GomokuGameStatus, GomokuGameTurn, RoomDetail, User } from "@/types";
import { ReactElement, useEffect, useState } from "react";
import css from './index.module.css';
import Logo from "@/components/common/logo";
import UserButton from "@/components/button/userButton";
import SigninButton from "@/components/button/signinButton";
import UserGameInfo from "@/components/controller/userGameInfo";
import { Col, Row } from "@nextui-org/react";
import Timer from "@/components/controller/timer";
import PutButton from "@/components/controller/putButton";

function Header({
    user
}: {
    user: User
}): ReactElement {
    return (
        <div className={css.header}>
            <Logo />
            {
                user ? <UserButton user={user} />
                : <SigninButton />
            }
        </div>
    );
};

function and(a: boolean, b: boolean): boolean {
    return a && b;
}

function Footer({
    roomDetail,
    putPress,
    onTurnTimeEnd
}: {
    roomDetail: RoomDetail,
    putPress: () => void,
    onTurnTimeEnd: () => void
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
                        isTurn={and(roomDetail.gameTurn == GomokuGameTurn.BLACK, roomDetail.gameStatus == GomokuGameStatus.START)}
                        user={roomDetail.blackPlayer}
                        gameUserHistory={roomDetail.blackGameUserHistory}
                        reversed={false}
                        color={GomokuGameTurn.BLACK}
                        imageSpan={4}/>
                </Col>
                <Col span={1.8} css={{ height: "100%", justifyContent: "center", display: "flex" }}>
                    <PutButton onPress={putPress}></PutButton>
                </Col>
                <Col span={5.1} css={{ height: "100%" }}>
                    <UserGameInfo
                        isTurn={and(roomDetail.gameTurn == GomokuGameTurn.WHITE, roomDetail.gameStatus == GomokuGameStatus.START)}
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

export default function Layout({
    children,
    user,
    roomDetail,
    putPress,
    onTurnTimeEnd
}: {
    children: ReactElement,
    user: User,
    roomDetail: RoomDetail,
    putPress: () => void,
    onTurnTimeEnd: () => void
}) {
    return (
        <div className={css.container}>
            <Header user={user}/>
            <main className={css.content}>
                { children }
            </main>
            <Footer
                roomDetail={roomDetail}
                putPress={putPress}
                onTurnTimeEnd={onTurnTimeEnd}/>
        </div>
    );
}