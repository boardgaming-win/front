import { ReactElement, useEffect, useMemo, useState } from "react";
import { Card, Text, Button, useInput, Loading, PressEvent } from "@nextui-org/react";
import { api } from '@/config/apiConfig';
import Router from "next/router";
import { EmailCodeValidtyStatus, EmailValidityStatus, EmailVerificationStatus, NameValidityStatus, PasswordValidityStatus } from "@/types";
import EmailVerificationForm from "./emailVerificationForm";
import NameVerificationForm from "./nameVerificationForm";
import PasswordConfirmForm from "./passwordConfirmForm";
import Swal from "sweetalert2";

const verificationTimeout: number = 120;

function getButtonText(
    emailVerificationStatus: EmailVerificationStatus,
    verificationTimer: number
): ReactElement {
    switch(emailVerificationStatus) {
        case EmailVerificationStatus.VERIFIED:
            return (
                <>
                    Sign Up
                </>
            );
        case EmailVerificationStatus.NOT_SENT:
            return (
                <>
                    Send Code
                </>
            );
        case EmailVerificationStatus.SENDING:
            return (
                <Loading color="currentColor" size="sm" />
            );
        case EmailVerificationStatus.SENT:
            return (
                <>
                    { verificationTimer }
                </>
            )
    }
}

export default function SignupForm() {
    const sessionKey = useMemo(() => {
        return `${Date.now()}`;
    }, []);
    
    const emailInput = useInput("");
    const [emailVerificationStatus, setEmailVerificationStatus] = useState(EmailVerificationStatus.NOT_SENT);
    const [emailValidityStatus, setEmailValidityStatus] = useState(EmailValidityStatus.UNCHECKED);
    const [emailCodeValidityStatus, setEmailCodeValidityStatus] = useState(EmailCodeValidtyStatus.UNCHECKED);
    const [verificationTimer, setVerificationTimer] = useState(0);
    const [verificationSendTime, setVerificationSendTime] = useState(0);

    useEffect(() => {
        switch (emailVerificationStatus) {
            case EmailVerificationStatus.VERIFIED:
                setNameVisible(true);
                setPasswordVisible(true);
                break;
            default:
                setNameVisible(false);
                setPasswordVisible(false);
        }
    }, [emailVerificationStatus]);

    useEffect(() => {
        switch (emailVerificationStatus) {
            case EmailVerificationStatus.NOT_SENT: 
                setButtonDisabled(emailValidityStatus != EmailValidityStatus.VALID);
                break;
            case EmailVerificationStatus.SENDING:
            case EmailVerificationStatus.SENT:
                setButtonDisabled(true);
                break;
            case EmailVerificationStatus.VERIFIED:
                setButtonDisabled(false);
                break;
        }
    }, [emailVerificationStatus, emailValidityStatus]);

    useEffect(() => {
        if (emailVerificationStatus != EmailVerificationStatus.SENT) {
            return;
        }

        setTimeout(() => {
            const newTimer = Math.max(Math.ceil((verificationSendTime + verificationTimeout * 1000 - Date.now()) / 1000), 0);

            if (newTimer > 0) {
                setVerificationTimer(newTimer);
            } else {
                setEmailVerificationStatus(EmailVerificationStatus.NOT_SENT);
            }
        }, 1000);
    }, [verificationTimer]);

    async function onChangeEmailInput() {
        try {
          const { data } = await api.get(`/api/user/check/email?email=${emailInput.value}`);
          setEmailValidityStatus(data.exists ? EmailValidityStatus.DUPLICATED : EmailValidityStatus.VALID);
          setEmailVerificationStatus(EmailVerificationStatus.NOT_SENT);
        } catch (error) {
          console.log(error);
        }
    };

    const nameInput = useInput("");
    const [nameValidityStatus, setNameValidityStatus] = useState(NameValidityStatus.UNCHECKED);
    const [nameVisible, setNameVisible] = useState(false);

    const onChangeNameInput = async () => {
        try {
          const { data } = await api.get(`/api/user/check/name?name=${nameInput.value}`);
          setNameValidityStatus(data.exists ? NameValidityStatus.DUPLICATED : NameValidityStatus.VALID);
        } catch (error) {
          console.log(error);
        }
    };
    
    const passwordInput = useInput("");
    const confirmPasswordInput = useInput("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordValidityStatus, setPasswordValidityStatus] = useState(PasswordValidityStatus.UNCHECKED);

    const [buttonDisabled, setButtonDisabled] = useState(true);
    
    async function onPress(e: PressEvent) {
        switch (emailVerificationStatus) {
            case EmailVerificationStatus.NOT_SENT:
                await emailVerification();
                break;
            case EmailVerificationStatus.VERIFIED:
                await signUp();
                break;
            default:
                throw new Error("Unreachable Code");
        }
    };

    async function emailVerification() {
        setEmailVerificationStatus(EmailVerificationStatus.SENDING);
        try {
            await api.post("/api/auth/verification/email/send/code", {
                email: emailInput.value,
                sessionKey: sessionKey
            });
            setVerificationTimer(verificationTimeout);
            setVerificationSendTime(Date.now());
            setEmailVerificationStatus(EmailVerificationStatus.SENT);
        } catch (err) {
            console.log(err);
            setEmailVerificationStatus(EmailVerificationStatus.NOT_SENT);
        }
    };
    
    async function signUp() {
        if (nameValidityStatus != NameValidityStatus.VALID) {
            setNameValidityStatus(NameValidityStatus.INVALID);
            return;
        }

        if (emailVerificationStatus != EmailVerificationStatus.VERIFIED) {
            setEmailValidityStatus(EmailValidityStatus.INVALID);
            return;
        }

        if (passwordValidityStatus != PasswordValidityStatus.VALID) {
            setPasswordValidityStatus(PasswordValidityStatus.INVALID);
            return;
        }

        try {
            const { data } = await api.post(`/api/auth/sign-up`, {
                name: nameInput.value,
                email: emailInput.value,
                sessionKey: sessionKey,
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value
            });

            if (data.id) {
                Router.push("/auth/sign-in");
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Sign in",
              text: `${error}`  
            });
          } 
    }

    return (
        <Card css={{ width: "500px", maxWidth: "90vw" }}>
            <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                <Text css={{
                    fontSize: "1.7em",
                    fontWeight: "bold",
                    margin: 0
                }}>Sign Up</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ boxSizing: "border-box" }}>
                <EmailVerificationForm
                    emailInput={emailInput}
                    sessionKey={sessionKey}
                    emailVerificationStatus={emailVerificationStatus}
                    setEmailVerificationStatus={setEmailVerificationStatus}
                    onChangeEmailInput={onChangeEmailInput}
                    emailValidityStatus={emailValidityStatus}
                    setEmailValidityStatus={setEmailValidityStatus}
                    emailCodeValidityStatus={emailCodeValidityStatus}
                    setEmailCodeValidityStatus={setEmailCodeValidityStatus} />
                <NameVerificationForm
                    visible={nameVisible}
                    nameInput={nameInput}
                    nameValidityStatus={nameValidityStatus}
                    setNameValidityStatus={setNameValidityStatus}
                    onChangeNameInput={onChangeNameInput} />
                <PasswordConfirmForm
                    visible={passwordVisible}
                    passwordInput={passwordInput}
                    confirmPasswordInput={confirmPasswordInput}
                    passwordValidityStatus={passwordValidityStatus}
                    setPasswordValidityStatus={setPasswordValidityStatus} />
            </Card.Body>
            <Card.Divider />
            <Card.Footer css={{ justifyContent: "center", boxSizing: "border-box" }}>
                <Button
                    size="lg"
                    css={{ width: "100%", fontSize: "1.2em" }}
                    onPress={onPress}
                    disabled={buttonDisabled}>
                    { getButtonText(emailVerificationStatus, verificationTimer) }
                </Button>
            </Card.Footer>
        </Card>
    )
};
  