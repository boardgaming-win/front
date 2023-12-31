import css from './notationButton.module.css';
export default function NotationButton({
    onClick,
    size
}: {
    onClick: () => void,
    size: string
}) {
    return (
        <div className={css.buttonWithIcon} onClick={onClick}>
            <svg width={size} height={size} viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="icomoon-ignore" />
                <path d="M6.294 14.164h12.588v1.049h-12.588v-1.049z" fill="#000000" />
                <path d="M6.294 18.36h12.588v1.049h-12.588v-1.049z" fill="#000000" />
                <path d="M6.294 22.557h8.392v1.049h-8.392v-1.049z" fill="#000000" />
                <path d="M15.688 3.674c-0.25-1.488-1.541-2.623-3.1-2.623s-2.85 1.135-3.1 2.623h-9.489v27.275h25.176v-27.275h-9.488zM10.49 6.082v-1.884c0-1.157 0.941-2.098 2.098-2.098s2.098 0.941 2.098 2.098v1.884l0.531 0.302c1.030 0.586 1.82 1.477 2.273 2.535h-9.803c0.453-1.058 1.243-1.949 2.273-2.535l0.53-0.302zM24.128 29.9h-23.078v-25.177h8.392v0.749c-1.638 0.932-2.824 2.566-3.147 4.496h12.588c-0.322-1.93-1.509-3.563-3.147-4.496v-0.749h8.392v25.177z" fill="#000000" />
            </svg>
            notation
        </div>
    )
}