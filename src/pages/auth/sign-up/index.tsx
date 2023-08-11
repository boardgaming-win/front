
import SignupForm from '@/components/auth/signUpForm';
import whoami from '@/functions/auth/serverProps/whoami';
import Layout from '@/layout/default';
import { User } from '@/types';
import { GetServerSidePropsContext } from 'next';

export default function SignUp({
    user
}: {
    user: User
}) {
    return (
        <Layout
            display="flex"
            justifyContent="center"
            alignItems="center">
            <SignupForm />
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
};
  