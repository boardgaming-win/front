import css from "./logo.module.css";
import Link from "next/link";

export default function logo() {
    return (
        <Link
            href="/"
            className={css.logo}>
            <span>BoardGaming</span>
        </Link>
    );
}