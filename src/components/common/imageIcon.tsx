import { User } from "@/types";
import css from './imageIcon.module.css';
import { ReactElement } from "react";

function getImageSrc(src: string): string {
    if (src.includes("http://") || src.includes("https://")) {
        return src;
    } else {
        return process.env.NEXT_PUBLIC_FILE_BASE_URL + "/file/" + src;
    }
}

export default function ImageIcon({
    user
}: {
    user?: User
}): ReactElement {
    if (user?.image) {
        return (
            <img
                src={getImageSrc(user.image)}
                className={css.userImage}
                draggable="false"/>
        );
    } else {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" stroke="black" />
            </svg>
        );
    }
}