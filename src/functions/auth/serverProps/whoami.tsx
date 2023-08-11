import { api, gomoku_api } from "@/config/apiConfig";
import { GameType, GameUserHistory, User } from "@/types";
import { GetServerSidePropsContext } from "next";

export default async function whoami(context: GetServerSidePropsContext, redirect: boolean, gameType: GameType | undefined = undefined) {
    try {
        const { data } = await api.get('/api/auth', {
          headers: {
            Cookie: context.req.headers.cookie
          }
        });

        const user: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          image: data.image,
          role: data.role
        };

        if (gameType == undefined) {
          return {
            props: {
              user
            }
          };
        } else {
          let gameUserHistory: GameUserHistory;

          switch (gameType) {
            case GameType.GOMOKU:
              const { data } = await gomoku_api.get("/api/user/history", {
                headers: {
                  Cookie: context.req.headers.cookie
                }
              });
              gameUserHistory = {
                winCnt: data.winCnt,
                loseCnt: data.loseCnt,
                drawCnt: data.drawCnt,
                rating: data.rating
              };
              break;
          }

          return {
            props: {
              user,
              gameUserHistory,
              cookie: context.req.headers.cookie
            }
          };
        }
      } catch (error) {
        if (redirect) {
            return {
                redirect: {
                  destination: '/auth/sign-in',
                  permanent: false
                }
            };
        } else {
            return {
                props: {
                  user: null
                }
            };
        }
      }
}