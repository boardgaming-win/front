import { ReactElement } from "react";

export default function OutIcon({
    size
}: {
    size: string
}): ReactElement {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <g id="signout" transform="translate(2 2)">
                <path id="Stroke_1" data-name="Stroke 1" d="M12.041.5H0" transform="translate(7.75 9.621)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
                <path id="Stroke_3" data-name="Stroke 3" d="M0,0,2.928,2.916,0,5.832" transform="translate(16.864 7.205)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
                <path id="Stroke_4" data-name="Stroke 4" d="M0,4.88C-.33,1.3-1.67,0-7,0c-7.1,0-7.1,2.31-7.1,9.25s0,9.25,7.1,9.25c5.33,0,6.67-1.3,7-4.88" transform="translate(14.36 0.75)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
            </g>
        </svg>
    );
}