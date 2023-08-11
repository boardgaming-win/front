
import SigninButton from '@/components/button/signinButton';
import UserButton from '@/components/button/userButton';
import Logo from '@/components/common/logo';
import { User } from '@/types';
import css from './default.module.css';
import { ReactElement } from 'react';

export default function Header({
    user
}: {
    user?: User
}): ReactElement {
    return (
        <div className={css.header}>
            <Logo />
            {
                user ? <UserButton user={user} />
                : <SigninButton />
            }
        </div>
    );
};