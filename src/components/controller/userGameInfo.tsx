import { GameUserHistory, GomokuGameTurn, User } from "@/types"
import { Grid, Row } from "@nextui-org/react"
import ImageIcon from "../common/imageIcon"
import css from './userGameInfo.module.css';
import { useState } from "react";
import UserInfoModal from "./userInfoModal";

export default function UserGameInfo({
    user,
    gameUserHistory,
    isTurn,
    color,
    reversed = false,
    imageSpan
}: {
    user?: User,
    gameUserHistory?: GameUserHistory,
    isTurn: boolean,
    color?: GomokuGameTurn
    reversed: boolean
    imageSpan: number
}) {
    const iconClass = [css.imageIcon];
    
    if (isTurn) {
        iconClass.push(css.highlight);
    } else if (color == GomokuGameTurn.BLACK) {
        iconClass.push(css.black);
    } else if (color == GomokuGameTurn.WHITE) {
        iconClass.push(css.white);
    }

    const [userInfoVisible, setUserInfoVisible] = useState(false);

    return (
        <> 
            {
                user && gameUserHistory && <UserInfoModal user={user} gameUserHistory={gameUserHistory} userInfoVisible={userInfoVisible} setUserInfoVisible={setUserInfoVisible} />
            }
            {
                reversed ? 
                <Grid.Container className={[css.userGameInfo].join(" ")}>
                    <Grid xs={12 - imageSpan} css={{ padding: "0 2vw 0 2vw", height: "100%", fontSize: "100%", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        <Row justify="flex-end">
                            <span>
                                { gameUserHistory ? `Rating: ${gameUserHistory.rating}` : "" }
                            </span>
                        </Row>
                        <Row justify="flex-end">
                            <span className={css.nameOverflow}>
                                {user? user.name : ""}
                            </span>
                        </Row>
                    </Grid>
                    <Grid xs={imageSpan} css={{ height: "100%" }} onClick={() => setUserInfoVisible(true)} justify="flex-start">
                        <div className={iconClass.join(" ")}>
                            <ImageIcon user={user}/>
                        </div>
                    </Grid>
                </Grid.Container> :
                <Grid.Container className={css.userGameInfo} direction="row">
                    <Grid xs={imageSpan} css={{ height: "100%" }} onClick={() => setUserInfoVisible(true)} justify="flex-end">
                        <div className={iconClass.join(" ")}>
                            <ImageIcon user={user}/>
                        </div>
                    </Grid>
                    <Grid xs={12 - imageSpan} css={{ padding: "0 2vw 0 2vw", height: "100%", fontSize: "100%", justifyContent: "center", flexDirection: "column" }}>
                        <Row>
                            <span>
                                { gameUserHistory ? `Rating: ${gameUserHistory.rating}` : "" }
                            </span>
                        </Row>
                        <Row>
                            <span className={css.nameOverflow}>
                                {user? user.name : ""}
                            </span>
                        </Row>
                    </Grid>
                </Grid.Container>
            }
        </>
    );
}