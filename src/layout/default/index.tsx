import { ReactElement } from 'react';
import css from './index.module.css';
import Logo from '@/components/common/logo';
import UserButton from '@/components/button/userButton';
import { User } from '@/types';
import SigninButton from '@/components/button/signinButton';

function Header({
    user
}: {
    user: User
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

function Footer(): ReactElement {
    return (
        <div className={css.footer}>
            Copyright © 2023. Boardgaming. All rights reserved.
        </div>
    );
};

export default function Layout({
    children,
    display,
    justifyContent,
    alignItems,
    user
}: any) {
    return (
        <div className={css.container}>
            <Header user={user}/>
            <main className={css.content} style={{ display, justifyContent, alignItems }}>
                { children }
            </main>
            <Footer />
        </div>
    )
};
  