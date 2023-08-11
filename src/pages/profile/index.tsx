import Layout from '@/layout/default';
import { NameValidityStatus, User } from '@/types';
import whoami from '@/functions/auth/serverProps/whoami';
import { GetServerSidePropsContext } from 'next';
import ChangeProfileForm from '@/components/profile/changeProfileForm';
import { api, file_api } from '@/config/apiConfig';
import Router from 'next/router';
import Swal from 'sweetalert2';

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
            const { oldFileId, newFileId } = (await api.get("/api/user/change/image")).data;

            if (oldFileId) {
                await file_api.delete(`/file/${oldFileId}`);
            }

            const formData = new FormData();
            formData.append("file", croppedImage, croppedImage.name);

            const { fileInfoId } = (await file_api.post(`/file/${newFileId}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            })).data;

            await api.put("/api/user/change/image", {
                imageFileInfoId: fileInfoId
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
    return (
        <Layout
            display="flex"
            alignItems="center"
            justifyContent="center"
            user={user}>
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