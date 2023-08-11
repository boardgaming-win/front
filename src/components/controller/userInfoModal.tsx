import { GameUserHistory, User } from "@/types";
import { Col, Modal, Row, Text } from "@nextui-org/react";
import ImageIcon from "../common/imageIcon";
import { Dispatch, SetStateAction } from "react";

function getRate(num: number, denom: number) {
    return denom == 0 ? 0 : Math.round(num / denom * 1000) /10
}

export default function UserInfoModal({
    user,
    gameUserHistory,
    userInfoVisible,
    setUserInfoVisible
}: {
    user: User,
    gameUserHistory: GameUserHistory,
    userInfoVisible: boolean,
    setUserInfoVisible: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Modal
            aria-labelledby="modal-title"
            closeButton
            width="788px"
            open={userInfoVisible}
            onClose={() => setUserInfoVisible(false)}>
            <Modal.Header>
                <Text b id="modal-title" size="200%">
                    User Info
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row justify="center">
                    <Col span={4} css={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                        <div style={{ aspectRatio: 1, height: "100%", border: "5px solid lightgrey", borderRadius: "50%", justifyContent: "center", alignItems: "center", display: "flex" }}>
                            <ImageIcon user={user} />
                        </div>
                    </Col>
                </Row>
                <Row justify="center">
                    <Text b id="name-text">Name: {user.name}</Text>
                </Row>
                <Row justify="center">
                    <Text b id="name-text">W/L: {gameUserHistory.winCnt}W / {gameUserHistory.loseCnt}L ({getRate(gameUserHistory.winCnt, gameUserHistory.winCnt + gameUserHistory.drawCnt + gameUserHistory.loseCnt)}%)</Text>
                </Row>
                <Row justify="center">
                    <Text b id="name-text">Rating: {gameUserHistory.rating}</Text>
                </Row>
            </Modal.Body>
        </Modal>
    )
}