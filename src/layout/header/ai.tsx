import { ReactElement } from 'react';
import css from './ai.module.css';
import Logo from '@/components/common/logo';
import SettingIcon from '@/components/icon/setting';

export default function Header({
    onSettingClick
}: {
    onSettingClick: () => void;
}): ReactElement {
    return (
        <div className={css.header}>
            <Logo />
            <div onClick={onSettingClick} className={css.button}>
                <SettingIcon size="5vh" />
            </div>
        </div>
    )
}