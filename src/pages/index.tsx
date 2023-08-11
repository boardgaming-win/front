import Layout from '@/layout/default';
import css from './index.module.css';
import { Card, Grid } from '@nextui-org/react';
import { User } from '@/types';
import { GetServerSidePropsContext } from 'next';
import whoami from '@/functions/serverProps/auth/whoami';
import Footer from '@/layout/footer/default';
import Header from '@/layout/header/default';

export default function Home({
  user
}: {
  user: User
}) {
  return (
    <Layout
      header={<Header user={user}/>}
      footer={<Footer />}>
      <Grid.Container gap={2} justify="center" css={{ width: "100%", margin: 0 }}>
        <Grid xs={12} sm={6}>
          <Card
            isPressable
            isHoverable
            variant="bordered">
            <a className={css.link} href="/gomoku/online">Gomoku Online</a>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card
            isPressable
            isHoverable
            variant="bordered">
            <a className={css.link} href="/gomoku/ai">Gomoku AI</a>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return whoami(context, false);
}
