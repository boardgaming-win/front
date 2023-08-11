import css from "./logo.module.css";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className={css.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-30 -30 160 160" fill="#000000">
                <g transform="rotate(45 50 50)">
                    <rect x="0" y="0" width="100" height="100" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                    <rect x="0" y="25" width="25" height="25" fill="#000000" />
                    <rect x="0" y="75" width="25" height="25" fill="#000000" />
                    <rect x="25" y="0" width="25" height="25" fill="#000000" />
                    <rect x="25" y="50" width="25" height="25" fill="#000000" />
                    <rect x="50" y="25" width="25" height="25" fill="#000000" />
                    <rect x="75" y="0" width="25" height="25" fill="#000000" />
                    <rect x="50" y="75" width="25" height="25" fill="#000000" />
                    <rect x="75" y="50" width="25" height="25" fill="#000000" />
                </g>
            </svg>
        </Link>
    );
}