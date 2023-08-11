import SigninForm from "@/components/auth/signinForm";
import whoami from "@/functions/serverProps/auth/whoami";
import Layout from "@/layout/default";
import Footer from "@/layout/footer/default";
import Header from "@/layout/header/default";
import { User } from "@/types";
import { GetServerSidePropsContext } from "next";

export default function Signin({
    user
}: {
    user?: User
}) {
    return (
        <Layout
            header={<Header user={user}/>}
            footer={<Footer />}>
            <SigninForm user={user}/>
        </Layout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, false);
}
  