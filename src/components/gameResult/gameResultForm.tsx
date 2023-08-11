import { RoomDetail, GomokuGameResult } from "@/types";
import { Grid, Row } from "@nextui-org/react";
import { ReactElement } from "react";
import ImageIcon from "../common/imageIcon";
import css from './gameResultForm.module.css';

export default function GameResultForm({
    roomDetail
}: {
    roomDetail: RoomDetail
}): ReactElement {
    let winner, loser;
    let isDraw;

    if (roomDetail.gameResult) {
        switch (roomDetail.gameResult) {
            case GomokuGameResult.BLACK_WIN:
                winner = roomDetail.blackPlayer;
                loser = roomDetail.whitePlayer;
                break;
            case GomokuGameResult.WHITE_WIN:
                loser = roomDetail.blackPlayer;
                winner = roomDetail.whitePlayer;
                break;
            case GomokuGameResult.DRAW:
                isDraw = true;
                break;
        }
    }

    return winner && loser ? (
        <Grid.Container gap={1}>
            <Row>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh", color: "green" }}>
                    WINNER
                </Grid>
                <Grid xs={2}/>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh", color: "red" }}>
                    LOSER
                </Grid>
            </Row>
            <Row justify="center" align="center" css={{ height: "13vh" }}>
                <Grid xs={5} justify="center" alignItems="center" css={{ height: "100%" }}>
                    <ImageIcon user={winner} />
                </Grid>
                <Grid xs={2} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    VS
                </Grid>
                <Grid xs={5} justify="center" alignItems="center" css={{ height: "100%" }}>
                    <ImageIcon user={loser} />
                </Grid>
            </Row>
            <Row>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    <span className={css.nameOverflow}>
                        { winner.name }
                    </span>
                </Grid>
                <Grid xs={2}/>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    <span className={css.nameOverflow}>
                        { loser.name }
                    </span>
                </Grid>
            </Row>
        </Grid.Container>
    ) : isDraw && roomDetail.blackPlayer && roomDetail.whitePlayer ? (
        <Grid.Container gap={1}>
            <Row>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    DRAW
                </Grid>
                <Grid xs={2}/>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    DRAW
                </Grid>
            </Row>
            <Row justify="center" align="center" css={{ height: "13vh" }}>
                <Grid xs={5} justify="center" alignItems="center" css={{ height: "100%" }}>
                    <ImageIcon user={roomDetail.blackPlayer} />
                </Grid>
                <Grid xs={2} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    VS
                </Grid>
                <Grid xs={5} justify="center" alignItems="center" css={{ height: "100%" }}>
                    <ImageIcon user={roomDetail.whitePlayer} />
                </Grid>
            </Row>
            <Row>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    <span className={css.nameOverflow}>
                        { roomDetail.blackPlayer.name }
                    </span>
                </Grid>
                <Grid xs={2}/>
                <Grid xs={5} justify="center" alignItems="center" css={{ fontSize: "2vh" }}>
                    <span className={css.nameOverflow}>
                        { roomDetail.whitePlayer.name }
                    </span>
                </Grid>
            </Row>
        </Grid.Container>
    ) : (
        <Grid.Container gap={1}>
            Error
        </Grid.Container>
    );
}