import Layout from '@/layout/default';
import { NameValidityStatus, User, UserRole } from '@/types';
import whoami from '@/functions/serverProps/auth/whoami';
import { GetServerSidePropsContext } from 'next';
import ChangeProfileForm from '@/components/profile/changeProfileForm';
import { api } from '@/config/apiConfig';
import Router from 'next/router';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import Header from '@/layout/header/default';
import Footer from '@/layout/footer/default';

async function onChangeNameInput(nameInput: string): Promise<NameValidityStatus> {
    if (nameInput == "") {
        return NameValidityStatus.INVALID;
    }
    
    try {
        const { data } = await api.get(`/api/user/check/name?name=${nameInput}`);

        if (data.exists) {
            return NameValidityStatus.DUPLICATED;
        } else {
            return NameValidityStatus.VALID;
        }
    } catch(err) {
        console.log(err);
        return NameValidityStatus.UNCHECKED;
    }
}

async function onSubmit(croppedImage: Blob | null, name: string | null): Promise<void> {
    try {
        if (croppedImage) {
            const formData = new FormData();
            formData.append("file", croppedImage, croppedImage.name);

            await api.put(`/api/user/change/image`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
        }
    
        if (name) {
            await api.patch("/api/user/change/profile", {
                name
            });
        }
    
        Router.push("/");
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Change profile",
            text: `${err}`
        });
    }
}

export default function profile({
    user
}: {
    user: User
}) {
    useEffect(() => {
        if (user.role == UserRole.GUEST) {
            Router.push("/");
        }
    }, []);

    return (
        <Layout
            header={<Header user={user}/>}
            footer={<Footer />}>
            <ChangeProfileForm
                user={user}
                onChangeNameInput={onChangeNameInput}
                onSubmit={onSubmit} />
        </Layout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return whoami(context, true);
}