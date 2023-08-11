import { Button, Card, Text, useInput } from '@nextui-org/react';
import css from './socialSignUpForm.module.css';
import { useState } from 'react';
import NameVerificationForm from './nameVerificationForm';
import { NameValidityStatus } from '@/types';
import { api } from '@/config/apiConfig';
import Router from 'next/router';
import Swal from 'sweetalert2';

export default function SocialSignUpForm() {
    const nameInput = useInput("");
    const [nameValidityStatus, setNameValidityStatus] = useState(NameValidityStatus.UNCHECKED);
    
    const onChangeNameInput = async () => {
        try {
          const { data } = await api.get(`/api/user/check/name?name=${nameInput.value}`);
          setNameValidityStatus(data.exists ? NameValidityStatus.DUPLICATED : NameValidityStatus.VALID);
        } catch (error) {
          console.log(error);
        }
    };

    async function socialSignIn() {
        if (nameValidityStatus != NameValidityStatus.VALID) {
            setNameValidityStatus(NameValidityStatus.INVALID);
            return;
        }

        try {
            await api.post(`/api/auth/sign-up/social`, {
                name: nameInput.value,
                key: Router.query.key
            });
        } catch (error) {
            await Swal.fire({
              icon: "error",
              title: "Social Signin",
              text: "Social signin has failed. Please try again later."
            });
        }

        Router.push("/");
    }
    
    return (
        <div className={css.center}>
            <div style={{ width: "90%", maxHeight: "500px", textAlign: "center" }}>
                <Card>
                    <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                        <Text css={{
                            fontSize: "150%",
                            fontWeight: "bold",
                            margin: 0
                        }}>Social Sign Up</Text>
                    </Card.Header>
                    <Card.Body css={{ boxSizing: "border-box" }}>
                        <NameVerificationForm
                            visible={true}
                            nameInput={nameInput}
                            nameValidityStatus={nameValidityStatus}
                            setNameValidityStatus={setNameValidityStatus}
                            onChangeNameInput={onChangeNameInput} />
                    </Card.Body>
                    <Card.Footer css={{ justifyContent: "center", boxSizing: "border-box", flexDirection: "column" }}>
                        <Button size="lg" css={{ width: "100%", fontSize: "120%" }} onPress={socialSignIn}>Sign up</Button>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
}