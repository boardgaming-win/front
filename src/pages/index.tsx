import Layout from '@/layout/default';
import css from './index.module.css';
import { Card, Grid } from '@nextui-org/react';
import router from 'next/router';
import { User } from '@/types';
import { GetServerSidePropsContext } from 'next';
import whoami from '@/functions/auth/serverProps/whoami';

export default function Home({
  user
}: {
  user: User
}) {
  return (
    <Layout user={user}>
      <Grid.Container gap={2} justify="center" css={{ width: "100%", margin: 0 }}>
        <Grid xs={12} sm={6}>
          <Card
            isPressable
            isHoverable
            variant="bordered"
            onClick={() => router.push("/gomoku/online")}>
            <span className={css.link}>Gomoku Online</span>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card
            isPressable
            isHoverable
            variant="bordered"
            onClick={() => router.push("/gomoku/ai")}>
            <span className={css.link}>Gomoku AI</span>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return whoami(context, false);
}
