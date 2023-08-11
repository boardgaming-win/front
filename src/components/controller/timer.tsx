export default function Timer({
    progress
}: {
    progress: number
}) {
    return (
        <div aria-label="progress" role="progressbar" style={{ width: '100%' }}>
            <div style={{ width: `${progress}%`, height: '2vh', backgroundColor: 'lightGreen', borderRadius: '7px', position: "absolute", zIndex: 99 }} />
            <div style={{ width: '100%', height: '2vh', backgroundColor: 'rgb(220, 220, 220)', borderRadius: '7px', position: "absolute", top: 0 }} />
        </div>
    )
}