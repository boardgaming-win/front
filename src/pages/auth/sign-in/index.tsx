import SigninForm from "@/components/auth/signinForm";
import { api } from "@/config/apiConfig";
import whoami from "@/functions/auth/serverProps/whoami";
import Layout from "@/layout/default";
import { User } from "@/types";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

export default function Signin({
    user
}: {
    user: User
}) {
    useEffect(() => {
        async function logout() {
            try {
                await api.delete('/api/auth');
            } catch (error) {
                console.log(error);
            }
        }

        if (user) {
            logout();
        }
    }, []);

    return (
        <Layout
            display="flex"
            justifyContent="center"
            alignItems="center">
            <SigninForm />
        </Layout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
}
  