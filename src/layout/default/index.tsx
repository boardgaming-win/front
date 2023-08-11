import { ReactElement } from 'react';
import css from './index.module.css';

export default function Layout({
    children,
    header,
    footer
}: {
    children: ReactElement,
    header: ReactElement,
    footer: ReactElement
}) {
    return (
        <div className={css.container}>
            <main className={css.content}>
                { header }
                { children }
                { footer }
            </main>
        </div>
    )
};
  