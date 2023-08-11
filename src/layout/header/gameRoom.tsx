import { ReactElement } from 'react';
import css from './gameRoom.module.css';
import Logo from '@/components/common/logo';
import Router from 'next/router';
import OutIcon from '@/components/icon/out';

export default function Header({
    outUrl
}: {
    outUrl: string
}): ReactElement {
    return (
        <div className={css.header}>
            <Logo />
            <div
                className={css.outButton}
                onClick={() => Router.push(outUrl)}>
                <OutIcon size="100%" />
            </div>
        </div>
    );
};