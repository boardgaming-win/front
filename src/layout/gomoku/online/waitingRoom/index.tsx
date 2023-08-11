import { User, GameUserHistory } from "@/types";
import { ReactElement } from "react";
import css from './index.module.css';
import Logo from "@/components/common/logo";
import UserButton from "@/components/button/userButton";
import SigninButton from "@/components/button/signinButton";
import { Button, Col, Row } from "@nextui-org/react";
import UserGameInfo from "@/components/controller/userGameInfo";

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

function RoundPlusIcon({
    size
}: {
    size: string
}): ReactElement {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 25" fill="none">
            <path
                d="M8 12.4H17M12.5 8V17M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z"
                stroke="white"
                strokeWidth="2"/>
        </svg>
    );
}

function Footer({
    user,
    gameUserHistory,
    startGame
}: {
    user: User,
    gameUserHistory: GameUserHistory,
    startGame: () => void
}): ReactElement {
    return (
       <div className={css.footer}>
            <Row css={{ height: "100%", maxWidth: "788px" }}>
                <Col span={7} css={{ height: "100%" }}>
                    <UserGameInfo user={user} gameUserHistory={gameUserHistory} reversed={false} isTurn={false} imageSpan={3}/>
                </Col>
                <Col span={5} css={{ height: "100%" }}>
                    <Button
                        auto
                        color="success"
                        css={{ height: "100%", width: "100%", minWidth: 0, fontSize: "2vh" }}
                        icon={<RoundPlusIcon size="3vh"/>}
                        onPress={startGame}>Start Game</Button>
                </Col>
            </Row>
       </div>
    );
}

export default function Layout({
    children,
    user,
    gameUserHistory,
    startGame
}: {
    children: ReactElement,
    user: User,
    gameUserHistory: GameUserHistory,
    startGame: () => void
}) {
    return (
        <div className={css.container}>
            <Header user={user}/>
            <main className={css.content}>
                { children }
            </main>
            <Footer user={user} gameUserHistory={gameUserHistory} startGame={startGame}/>
        </div>
    );
}