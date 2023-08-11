import ChangePasswordForm from '@/components/auth/changePasswordForm';
import whoami from '@/functions/auth/serverProps/whoami';
import Layout from "@/layout/default";
import { User } from '@/types';
import { GetServerSidePropsContext } from 'next';

export default function ChangePassword({
    user
}: {
    user: User
}) {
    return (
        <Layout
            display="flex"
            justifyContent="center"
            alignItems="center"
            user={user}>
            <ChangePasswordForm />
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
}