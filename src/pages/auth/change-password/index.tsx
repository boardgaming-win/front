import ChangePasswordForm from '@/components/auth/changePasswordForm';
import whoami from '@/functions/serverProps/auth/whoami';
import Layout from "@/layout/default";
import Footer from '@/layout/footer/default';
import Header from '@/layout/header/default';
import { User, UserRole } from '@/types';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';

export default function ChangePassword({
    user
}: {
    user?: User
}) {
    useEffect(() => {
        if (user?.role == UserRole.GUEST) {
            Router.push("/");
        }
    }, []);

    return (
        <Layout
            header={<Header user={user}/>}
            footer={<Footer />}>
            <ChangePasswordForm />
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
}