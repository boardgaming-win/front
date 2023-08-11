import css from './index.module.css';
import { Row, Container, Col, Card, Modal, Loading, Button } from '@nextui-org/react';
import { GameType, GameUserHistory, Room, User } from '../../../types';
import { GetServerSidePropsContext } from 'next/types';
import whoami from '@/functions/auth/serverProps/whoami';
import { useEffect, useState } from 'react';
import { gomoku_ws } from '@/config/socketConfig';
import { gomoku_api } from '@/config/apiConfig';
import { Frame } from '@stomp/stompjs';
import Layout from '@/layout/gomoku/online/waitingRoom';
import Router from 'next/router';
import Swal from 'sweetalert2';

const RoomEl = (room: Room) => {
  return (
    <Card
      isPressable
      isHoverable
      variant="bordered"
      css={{ width: "100%" }}>
      <Card.Body>
        <Row align="center" className={css.roomRow} onClick={() => Router.push(`/gomoku/online/room/${room.id}`)}>
          <Col span={8}>
            <Row align="center">
              <div className={[css.black, css.playerDiv].join(" ")} />
              <span className={css.roomText}>
                { room.blackPlayer? room.blackPlayer.name : "-" }
              </span>
            </Row>
            <Row align="center">
              <div className={[css.white, css.playerDiv].join(" ")} />
              <span className={css.roomText}>
                { room.whitePlayer? room.whitePlayer.name : "-" }
              </span>
            </Row>
          </Col>
          <Col span={1}/>
          <Col span={3}>
            <span>{ `${room.pieceCnt} moves` }</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default function GomokuOnline({
  user,
  gameUserHistory
}: {
  user: User,
  gameUserHistory: GameUserHistory
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [waitingSubUrl, setWaitingSubUrl] = useState<string>("");
  const [waitingVisible, setWaitingVisible] = useState(false);

  useEffect(() => {
    gomoku_ws.connect({}, async () => {
      const { data } = await gomoku_api.get("/api/room");

      setRooms(data);

      gomoku_ws.subscribe("/sub/room", (message: Frame) => {
        setRooms(JSON.parse(message.body));
      });
    });

    return () => {
      gomoku_ws.disconnect();
    }
  }, []);

  async function startGame() {
    try {
      const { data } = await gomoku_api.get("/api/room/play");
      
      if (data?.id) {
        Router.push(`/gomoku/online/room/${data.id}`);
        return;
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Start game",
        text: `${err}`
      });
    }

    try {
      const { data } = await gomoku_api.post("/api/game-queue");

      setWaitingSubUrl(data.subUrl);

      gomoku_ws.subscribe(data.subUrl, (message: Frame) => {
        gomoku_ws.onWebSocketClose = (event) => {};
        Router.push(`/gomoku/online/room/${JSON.parse(message.body)}`);
      });
      setWaitingVisible(true);

      gomoku_ws.onWebSocketClose = function(event) {
        setWaitingVisible(false);
        gomoku_ws.onWebSocketClose = (event) => {};
        
        Swal.fire({
          icon: "error",
          title: "Server connection error",
          text: 'Please retry in a moment'
        })
      };
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Start game",
        text: `${err}`
      });
    }
  }

  async function cancelWaiting() {
    await gomoku_api.delete("/api/game-queue");
    gomoku_ws.unsubscribe(waitingSubUrl);

    setWaitingVisible(false);
    gomoku_ws.onWebSocketClose = (event) => {};
  }

  return (
    <>
      <Modal
        preventClose
        open={waitingVisible}
        width="600px">
        <Modal.Header css={{ fontSize: "2.5vh" }}>Waiting for opponent</Modal.Header>
        <Modal.Body>
            <Loading size="lg"/>
        </Modal.Body>
        <Modal.Footer css={{ padding: "1vh 1vh 1vh 1vh" }}>
            <Button css={{ width: "100%", fontSize: "2vh" }} color="error" onPress={cancelWaiting}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Layout user={user} gameUserHistory={gameUserHistory} startGame={startGame}>
        <div className={css.home}>
          <Container gap={0}>
          {
            rooms.map((room: Room, index: Number) => (
              <RoomEl {...room} key={`${index}`}></RoomEl>
            ))
          }
          </Container>
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return whoami(context, true, GameType.GOMOKU);
}
