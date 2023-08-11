import { ReactElement } from "react";

export default function RoundPlusIcon({
    size
}: {
    size: string
}): ReactElement {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 25" fill="none">
            <path
                d="M8 12.4H17M12.5 8V17M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z"
                stroke="white"
                strokeWidth="2"/>
        </svg>
    );
}
