import { GameHistoryDetail, GomokuGameTurn } from '@/types';
import css from './gameHistory.module.css';
import { ReactElement } from 'react';
import { Col, Grid } from '@nextui-org/react';
import ArrowLeft from '@/components/icon/arrowLeft';
import ArrowRight from '@/components/icon/arrowRight';
import UserGameInfo from '@/components/controller/userGameInfo';

export default function Footer({
    gameHistoryDetail,
    currentMoveIndex,
    setCurrentMoveIndex
}: {
    gameHistoryDetail?: GameHistoryDetail,
    currentMoveIndex: number,
    setCurrentMoveIndex: (moveIndex: number) => void
}): ReactElement {
    function prevMove() {
        if (currentMoveIndex > 1) {
            setCurrentMoveIndex(currentMoveIndex - 1);
        }
    };

    function nextMove() {
        if (gameHistoryDetail?.moveStack.length && currentMoveIndex < gameHistoryDetail?.moveStack.length) {
            setCurrentMoveIndex(currentMoveIndex + 1);
        }
    };

    return (
        <Grid.Container className={css.footer}>
            <Grid className={css.controller}>
                <Col span={5} css={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
                    <div className={css.button} onClick={prevMove}>
                        <ArrowLeft size="100%"/>
                    </div>
                </Col>
                <Col span={2} css={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    { currentMoveIndex } / { gameHistoryDetail?.moveStack.length }
                </Col>
                <Col span={5} css={{ display: "flex", justifyContent: "flex-start", height: "100%" }}>
                    <div className={css.button} onClick={nextMove}>
                        <ArrowRight size="100%"/>
                    </div>
                </Col>
            </Grid>
            <Grid className={css.userInfo} alignItems="stretch">
                <Col span={6} css={{ height: "100%" }}>
                    <UserGameInfo
                        user={gameHistoryDetail?.blackPlayer}
                        gameUserHistory={gameHistoryDetail?.blackGameUserHistory}
                        reversed={false}
                        color={GomokuGameTurn.BLACK}
                        imageSpan={4}/>
                </Col>
                <Col span={6} css={{ height: "100%" }}>
                    <UserGameInfo
                        user={gameHistoryDetail?.whitePlayer}
                        gameUserHistory={gameHistoryDetail?.whiteGameUserHistory}
                        reversed={true}
                        color={GomokuGameTurn.WHITE}
                        imageSpan={4}/>
                </Col>
            </Grid>
        </Grid.Container>
    );
}