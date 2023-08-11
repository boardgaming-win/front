import { Dispatch, ReactElement, SetStateAction } from 'react';
import css from './index.module.css';
import { Grid } from '@nextui-org/react';
import Logo from '@/components/common/logo';
import SettingIcon from '@/components/icon/setting';

function Header({
    setSettingVisible
}: {
    setSettingVisible: Dispatch<SetStateAction<boolean>>
}): ReactElement {
    return (
        <div className={css.header}>
            <Logo />
            <div onClick={() => setSettingVisible(true)} className={css.button}>
                <SettingIcon size="5vh" />
            </div>
        </div>
    )
}

function Controller({
    undoClick,
    putClick,
    resetClick
}: {
    undoClick: () => void,
    putClick: () => void,
    resetClick: () => void
}): ReactElement {
    return (
        <div className={css.controller}>
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
    )
}

export default function Layout({
    children,
    setSettingVisible,
    undoClick,
    putClick,
    resetClick
}: {
    children: ReactElement,
    setSettingVisible: Dispatch<SetStateAction<boolean>>,
    undoClick: () => void,
    putClick: () => void,
    resetClick: () => void
}) {
    return (
        <div className={css.container}>
            <main className={css.content}>
                <Header setSettingVisible={setSettingVisible}/>
                { children }
                <Controller
                    undoClick={undoClick}
                    putClick={putClick}
                    resetClick={resetClick}/>
            </main>
        </div>
    )
};
  