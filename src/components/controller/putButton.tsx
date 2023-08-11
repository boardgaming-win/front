import { ReactElement } from "react";
import css from './putButton.module.css';

export default function PutButton({
    onPress
}: {
    onPress: () => void;
}): ReactElement {
    return (
        <div className={css.putButton} onClick={onPress}>
            <div className={css.putButtonInside}/>
        </div>
    )
}