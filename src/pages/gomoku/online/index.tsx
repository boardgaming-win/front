import css from './index.module.css';
import { Row, Col, Card, Modal, Loading, Button, Pagination } from '@nextui-org/react';
import { GameHistory, GameType, GameUserHistory, GomokuGameTurn, GomokuUserResult, OnlineNavTarget, Room, User } from '../../../types';
import { GetServerSidePropsContext } from 'next/types';
import whoami from '@/functions/serverProps/auth/whoami';
import { useEffect, useState } from 'react';
import { gomoku_ws } from '@/config/socketConfig';
import { gomoku_api } from '@/config/apiConfig';
import { Frame } from '@stomp/stompjs';
import Layout from '@/layout/default';
import Router from 'next/router';
import Swal from 'sweetalert2';
import Header from '@/layout/header/default';
import Footer from '@/layout/footer/onlineWaitingRoom';

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

function signNumber(num: number) {
  return num > 0 ? "+" + num : num;
}

function resultMark(color: GomokuGameTurn, result: GomokuUserResult) {
  const colorMark = color[0].toUpperCase() + color.slice(1).toLowerCase();
  switch(result) {
    case GomokuUserResult.WIN:
      return (
        <>
          <span style={{ color: "green" }}>{colorMark + " Win"}</span>
        </>
      );
    case GomokuUserResult.DRAW:
      return (
        <>
          <span style={{ color: "brown" }}>{colorMark + " Draw"}</span>
        </>
      );
    case GomokuUserResult.LOSE:
      return (
        <>
          <span style={{ color: "red" }}>{colorMark + " Lose"}</span>
        </>
      );
  }
}

const GameHistoryEl = (gameHistory: GameHistory) => {
  return (
    <Card
      isPressable
      isHoverable
      variant="bordered"
      css={{ width: "100%", padding: 0 }}>
      <Card.Body css={{ padding: "1vh" }}>
        <Row align="center" className={css.roomRow} onClick={() => Router.push(`/gomoku/online/gameHistory/${gameHistory.id}`)}>
          <Col span={6} css={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            vs { gameHistory.opponent }
          </Col>
          <Col span={6} css={{ display: "flex", justifyContent: "flex-end" }}>
            {resultMark(gameHistory.userColor, gameHistory.result)}&nbsp;{signNumber(gameHistory.afterRating - gameHistory.beforeRating)}&nbsp;
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
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

  const [currentNav, setCurrentNav] = useState<OnlineNavTarget>(OnlineNavTarget.PLAY);

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

  const [gameHistorys, setGameHistorys] = useState<GameHistory[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  async function getAndUpdateGameHistorys(page: number) {
    const { data } = await gomoku_api.get(`/api/gameHistory?page=${page}&size=10&sort=id,desc`);
    setTotalPages(data.totalPages);
    setGameHistorys(data.content);
  }

  async function onPageChange(page: number) {
    await getAndUpdateGameHistorys(page - 1);
  }

  useEffect(() => {
    if (currentNav == OnlineNavTarget.NOTATION) {
      getAndUpdateGameHistorys(0);
    }
  }, [currentNav]);
  if (currentNav == OnlineNavTarget.NOTATION) {
    return (
      <>
        <Layout
          header={<Header user={user}/>}
          footer={<Footer user={user} gameUserHistory={gameUserHistory} startGame={startGame} currentNav={currentNav} setCurrentNav={setCurrentNav}/>}>
          <div className={css.home}>
            {
              gameHistorys.map((gameHistory: GameHistory, index: number) => (
                <GameHistoryEl {...gameHistory} key={`${index}`}/>
              ))
            }
            <div style={{ display: totalPages != 0 ? "block" : "none" }}>
              <div className={css.pagination}>
                <Pagination total={totalPages} initialPage={1} onChange={onPageChange} size="sm" />
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <Modal
          preventClose
          open={waitingVisible}
          width="500px">
          <Modal.Header css={{ fontSize: "2.5vh" }}>Waiting for opponent</Modal.Header>
          <Modal.Body>
              <Loading size="lg"/>
          </Modal.Body>
          <Modal.Footer css={{ padding: "1vh 1vh 1vh 1vh" }}>
              <Button css={{ width: "100%", fontSize: "2vh" }} color="error" onPress={cancelWaiting}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        <Layout
          header={<Header user={user}/>}
          footer={<Footer user={user} gameUserHistory={gameUserHistory} startGame={startGame} currentNav={currentNav} setCurrentNav={setCurrentNav}/>}>
          <div className={css.home}>
            {
              rooms.map((room: Room, index: number) => (
                <RoomEl {...room} key={`${index}`}/>
              ))
            }
          </div>
        </Layout>
      </>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return whoami(context, true, GameType.GOMOKU);
}
