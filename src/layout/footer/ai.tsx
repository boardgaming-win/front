import { ReactElement } from "react";
import css from './ai.module.css';
import { Grid } from "@nextui-org/react";

export default function Footer({
    undoClick,
    putClick,
    resetClick
}: {
    undoClick: () => void,
    putClick: () => void,
    resetClick: () => void
}): ReactElement {
    return (
        <div className={css.footer}>
            <Grid.Container justify="center">
                <Grid xs={4} justify="center">
                    <button
                        className={css.controllerbutton}
                        onClick={undoClick}>
                        <span className={css.controllerbuttontext}>
                            UNDO
                        </span>
                    </button>
                </Grid>
                <Grid xs={4} justify="center">
                    <button
                        className={css.controllerbutton}
                        onClick={putClick}>
                        <span className={css.controllerbuttontext}>
                            PUT
                        </span>
                    </button>
                </Grid>
                <Grid xs={4} justify="center">
                    <button
                        className={css.controllerbutton}
                        onClick={resetClick}>
                        <span className={css.controllerbuttontext}>
                            RESET
                        </span>
                    </button>
                </Grid>
            </Grid.Container>
        </div>
    );
}