import { OnlineNavTarget } from "@/types";
import css from './onlineNav.module.css';
import { Grid, Spacer } from "@nextui-org/react";
import PlayButton from "../button/playButton";
import NotationButton from "../button/notationButton";

export default function OnlineNav({
    currentNav,
    setCurrentNav
}: {
    currentNav: OnlineNavTarget,
    setCurrentNav: (target: OnlineNavTarget) => void
}) {
    const playClassNames = [css.onlineNavButton];
    const notationClassNames = [css.onlineNavButton];

    switch (currentNav) {
        case OnlineNavTarget.PLAY:
            playClassNames.push(css.selected);
            break;
        case OnlineNavTarget.NOTATION:
            notationClassNames.push(css.selected);
            break;
    }

    return (
        <Grid.Container css={{ height: "100%" }} justify="flex-end" alignItems="stretch">
            <Grid className={playClassNames.join(" ")}>
                <PlayButton onClick={() => setCurrentNav(OnlineNavTarget.PLAY)} size="3vh"/>
            </Grid>
            <Spacer x={0.5}/>
            <Grid className={notationClassNames.join(" ")}>
                <NotationButton onClick={() => setCurrentNav(OnlineNavTarget.NOTATION)} size="3vh"/>
            </Grid>
        </Grid.Container>
    );
}