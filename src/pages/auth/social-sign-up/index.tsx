import SocialSignUpForm from "@/components/auth/socialSignUpForm";
import Layout from "@/layout/default";
import Footer from "@/layout/footer/default";
import Header from "@/layout/header/default";
import { User } from "@/types";

export default function SocialSignUp({
    user
}: {
    user: User
}) {
    return (
        <Layout
            header={<Header user={user}/>}
            footer={<Footer />}>
            <SocialSignUpForm />
        </Layout>
    );
}