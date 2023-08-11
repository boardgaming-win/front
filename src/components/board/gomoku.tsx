import { Color, Target } from '@/types';
import css from './gomoku.module.css';

export default function GomokuBoard({
    targetClick,
    boardRows,
    position,
    targetState
}: {
    targetClick?: (rank: number, file: number) => void,
    boardRows: number,
    position: Array<Array<Color>>,
    targetState?: Array<Array<Target>>
}) {
    const points = [{
        top: `50%`,
        left: `50%`,
    },
    {
        top: `${300/14}%`,
        left: `${300/14}%`,
    },
    {
        top: `${1100/14}%`,
        left: `${1100/14}%`,
    },
    {
        top: `${300/14}%`,
        left: `${1100/14}%`,
    },
    {
        top: `${1100/14}%`,
        left: `${300/14}%`,
    }];

    return (
        <div className={css.board}>
            <div className={css.boundary}>
                {
                    points.map((pointStyle, index) => 
                        <div className={css.point}
                            style={pointStyle}
                            key={index}/>
                    ) 
                }
                {
                    [...Array(boardRows)]
                        .map((_, i) => (
                            <div className={css.row} key={i}>
                                {
                                    [...Array(boardRows)].map((_, j) => (
                                        <div className={`${css.square} ${css.borderblack}`} key={i*100+j} />
                                    ))
                                }
                            </div>
                        ))
                }
            </div>
            <div className={css.play}>
                {
                    [...Array(boardRows + 1)]
                        .map((_, i) => (
                            <div className={css.rowPlay} key={i}>
                                {
                                    [...Array(boardRows + 1)].map((_, j) => (
                                        <div className={css.square} key={i*100+j}>
                                            <div
                                                className={`${css.target} ${targetState && css[Target[targetState[i][j]]]}`}
                                                onClick={() => targetClick && targetClick(i, j)} />
                                            <div className={`${css[Color[position[i][j]]]} ${css.stone} ${css.center}`} />
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                }
            </div>
        </div>
    )
}
