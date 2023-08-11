import { BindingsChangeTarget } from "@nextui-org/react/types/use-input/use-input";
import { UserInfo } from "os";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

enum Target {
    HIDE = 'HIDE',
    SELECT = 'SELECT',
    LAST = 'LAST'
};

enum Color {
    HIDE = 'HIDE',
    BLACK = 'BLACK',
    WHITE = 'WHITE',
    BAN = 'BAN'
};

enum WinState {
    NONE = 'NONE',
    BLACK = 'BLACK',
    WHITE = 'WHITE',
    DRAW = 'DRAW'
};

enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUEST = 'GUEST'
};

enum GomokuRule {
    DEFAULT = "DEFAULT",
    RENJU = 'RENJU'
};

enum GameType {
    GOMOKU = 'GOMOKU'
};

type User = {
    name: string,
    id: string,
    email: string,
    role?: UserRole,
    imageFileUrl: string | null;
}

type GameUserHistory = {
    winCnt: number,
    loseCnt: number,
    drawCnt: number,
    rating: number,
}

type Room = {
    id: number,
    blackPlayer: User | null,
    whitePlayer: User | null,
    pieceCnt: number
};

type RoomDetail = {
    id: number,
    rule: GomokuRule,
    turnTime: number,
    turnTimeLeft: number
    blackPlayer?: User,
    blackGameUserHistory?: GameUserHistory,
    whitePlayer?: User,
    whiteGameUserHistory?: GameUserHistory,
    moveStack: Array<number>,
    gameStatus: GomokuGameStatus,
    gameTurn: GomokuGameTurn,
    gameResult?: GomokuGameResult,
    gameResultReason?: GomokuGameResultReason
}

enum GomokuGameResult {
    BLACK_WIN = 'BLACK_WIN',
    WHITE_WIN = 'WHITE_WIN',
    DRAW = 'DRAW'
};

enum GomokuUserResult {
    WIN = "WIN",
    DRAW = "DRAW",
    LOSE = "LOSE"
};

enum GomokuGameResultReason {
    TIME_OUT = 'TIME_OUT',
    DISCONNECT = 'DISCONNECT',
    DEFAULT = 'DEFAULT'
}

enum GomokuGameStatus {
    WAITING = 'WAITING',
    START = 'START',
    END = 'END'
};

enum GomokuGameTurn {
    BLACK = 'BLACK',
    WHITE = 'WHITE'
};

type InputType = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    currentRef: MutableRefObject<string>;
    reset: () => void;
    bindings: { value: string; onChange: (event: BindingsChangeTarget) => void; };
};

enum EmailVerificationStatus {
    NOT_SENT = 'NOT_SENT',
    SENDING = 'SENDING',
    SENT = 'SENT',
    VERIFIED = 'VERIFIED'
};

enum EmailValidityStatus {
    UNCHECKED = 'UNCHECKED',
    INVALID = 'INVALID',
    DUPLICATED = 'DUPLICATED',
    NOT_EXISTS = 'NOT_EXISTS',
    VALID = 'VALID'
}

enum EmailCodeValidtyStatus {
    UNCHECKED = 'UNCHECKED',
    INCORRECT = 'INCORRECT',
    VALID = 'VALID'
};

enum NameValidityStatus {
    UNCHECKED = 'UNCHECKED',
    INVALID = 'INVALID',
    DUPLICATED = 'DUPLICATED',
    VALID = 'VALID'
};

enum PasswordValidityStatus {
    UNCHECKED = 'UNCHECKED',
    INVALID = 'INVALID',
    NOT_EQUAL = 'NOT_EQUAL',
    VALID = 'VALID'
}

type GameHistory = {
    id: number,
    opponent: String,
    userColor: GomokuGameTurn,
    result: GomokuUserResult,
    beforeRating: number,
    afterRating: number
}

type GameHistoryDetail = {
    id: number,
    blackPlayer: User,
    blackGameUserHistory: GameUserHistory,
    blackPlayerBeforeRating: number,
    blackPlayerAfterRating: number,
    whitePlayer: User,
    whiteGameUserHistory: GameUserHistory,
    whitePlayerBeforeRating: number,
    whitePlayerAfterRating: number,
    gameResult: GomokuGameResult,
    gameResultReason: GomokuGameResultReason,
    moveStack: Array<number>
}

enum OnlineNavTarget {
    PLAY = "PLAY",
    NOTATION = "NOTATION"
}
export {
    Target,
    Color,
    WinState,
    EmailVerificationStatus,
    NameValidityStatus,
    PasswordValidityStatus,
    EmailValidityStatus,
    EmailCodeValidtyStatus,
    GomokuRule,
    UserRole,
    GameType,
    GomokuGameStatus,
    GomokuGameTurn,
    GomokuGameResult,
    GomokuGameResultReason,
    OnlineNavTarget,
    GomokuUserResult
};
export type {
    User,
    Room,
    RoomDetail,
    InputType,
    GameUserHistory,
    GameHistory,
    GameHistoryDetail
};

