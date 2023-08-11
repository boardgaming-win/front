import Link from 'next/link';
import css from './signinButton.module.css';

export default function SigninButton() {
    return (
        <div className={css.linkGroup}>
            <div>
                <Link href="/auth/sign-in" className={css.link}>Sign in</Link>
            </div>
            <div role="separator" className={css.separator}></div>
            <div className={css.borderBox}>
                <Link href="/auth/sign-up" className={css.link}>Sign up</Link>
            </div>
        </div>
    );
}