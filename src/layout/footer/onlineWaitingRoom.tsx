import { GameUserHistory, OnlineNavTarget, User } from '@/types';
import css from './onlineWaitingRoom.module.css';
import { ReactElement } from 'react';
import { Button, Col, Grid } from '@nextui-org/react';
import RoundPlusIcon from '@/components/icon/roundPlus';
import UserGameInfo from '@/components/controller/userGameInfo';
import OnlineNav from '@/components/controller/onlineNav';

export default function Footer({
    user,
    gameUserHistory,
    startGame,
    currentNav,
    setCurrentNav
}: {
    user: User,
    gameUserHistory: GameUserHistory,
    startGame: () => void,
    currentNav: OnlineNavTarget,
    setCurrentNav: (target: OnlineNavTarget) => void
}): ReactElement {
    if (currentNav == OnlineNavTarget.PLAY) {
        return (
            <Grid.Container className={css.footer} justify="center">
                 <Grid css={{ maxWidth: "500px", padding: "1vh 1.5vw 1vh 1.5vw", height: "5vh" }}>
                     <Col span={12} css={{ height: "100%" }}>
                         <Button
                             auto
                             color="success"
                             css={{ height: "100%", width: "100%", minWidth: 0, fontSize: "2vh" }}
                             icon={<RoundPlusIcon size="3vh"/>}
                             onPress={startGame}>Start Game</Button>
                     </Col>
                 </Grid>
                 <Grid css={{ maxWidth: "500px", padding: "1vh 1.5vw 1vh 1.5vw", backgroundColor: "white", display: "flex", height: "8vh" }} alignItems="stretch">
                     <Col span={7}>
                         <UserGameInfo user={user} gameUserHistory={gameUserHistory} reversed={false} isTurn={false} imageSpan={3}/>
                     </Col>
                     <Col span={5}>
                         <OnlineNav currentNav={currentNav} setCurrentNav={setCurrentNav}/>
                     </Col>
                 </Grid>
            </Grid.Container>
         );
    } else {
        return (
            <Grid.Container className={css.footer} justify="center">
                <Grid css={{ maxWidth: "500px", padding: "1vh 1.5vw 1vh 1.5vw", backgroundColor: "white", display: "flex", height: "8vh" }} alignItems="stretch">
                    <Col span={7}>
                        <UserGameInfo user={user} gameUserHistory={gameUserHistory} reversed={false} isTurn={false} imageSpan={3}/>
                    </Col>
                    <Col span={5}>
                        <OnlineNav currentNav={currentNav} setCurrentNav={setCurrentNav}/>
                    </Col>
                </Grid>
            </Grid.Container>
        )
    }
}