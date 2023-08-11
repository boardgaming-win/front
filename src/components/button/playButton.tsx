import css from './playButton.module.css';

export default function PlayButton({
    onClick,
    size
}: {
    onClick: () => void,
    size: string
}) {
    return (
        <div className={css.buttonWithIcon} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width={size} height={size} version="1.1" id="Layer_1" viewBox="0 0 512 512">
            <g>
                <g>
                    <g>
                        <path d="M256,0C114.618,0,0,114.618,0,256s114.618,256,256,256s256-114.618,256-256S397.382,0,256,0z M256,469.333     c-117.818,0-213.333-95.515-213.333-213.333S138.182,42.667,256,42.667S469.333,138.182,469.333,256S373.818,469.333,256,469.333     z"/>
                        <path d="M375.467,238.933l-170.667-128c-14.064-10.548-34.133-0.513-34.133,17.067v256c0,17.58,20.07,27.615,34.133,17.067     l170.667-128C386.844,264.533,386.844,247.467,375.467,238.933z M213.333,341.333V170.667L327.111,256L213.333,341.333z"/>
                    </g>
                </g>
            </g>
            </svg>
            play
        </div>
    )
}