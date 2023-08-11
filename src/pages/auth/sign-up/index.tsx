
import SignupForm from '@/components/auth/signUpForm';
import whoami from '@/functions/serverProps/auth/whoami';
import Layout from '@/layout/default';
import Footer from '@/layout/footer/default';
import Header from '@/layout/header/default';
import { User } from '@/types';
import { GetServerSidePropsContext } from 'next';

export default function SignUp({
    user
}: {
    user: User
}) {
    return (
        <Layout
            header={<Header user={user}/>}
            footer={<Footer />}>
            <SignupForm />
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
};
  