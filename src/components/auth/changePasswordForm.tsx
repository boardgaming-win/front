import { Card, Text, Button, useInput, Loading } from "@nextui-org/react";
import { ReactElement, useEffect, useMemo, useState } from "react";
import EmailVerificationForm from "./emailVerificationForm";
import { EmailCodeValidtyStatus, EmailValidityStatus, EmailVerificationStatus, PasswordValidityStatus } from "@/types";
import { api } from "@/config/apiConfig";
import Router from "next/router";
import PasswordConfirmForm from "./passwordConfirmForm";
import Swal from "sweetalert2";
import css from './changePasswordForm.module.css';

const verificationTimeout: number = 120;

function getButtonText(
    emailVerificationStatus: EmailVerificationStatus,
    verificationTimer: number
): ReactElement {
    switch(emailVerificationStatus) {
        case EmailVerificationStatus.VERIFIED:
            return (
                <>
                    Change Password
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

export default function ChangePasswordForm() {
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
                setPasswordVisible(true);
                break;
            default:
                setPasswordVisible(false);
        }
    }, [emailVerificationStatus]);

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
          setEmailValidityStatus(data.exists ? EmailValidityStatus.VALID : EmailValidityStatus.NOT_EXISTS);
          setEmailVerificationStatus(EmailVerificationStatus.NOT_SENT);
        } catch (error) {
            console.log(error);
        }
    };

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

    const passwordInput = useInput("");
    const confirmPasswordInput = useInput("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordValidityStatus, setPasswordValidityStatus] = useState(PasswordValidityStatus.UNCHECKED);

    const [buttonDisabled, setButtonDisabled] = useState(true);

    async function onPress() {
        switch (emailVerificationStatus) {
            case EmailVerificationStatus.NOT_SENT:
                await emailVerification();
                break;
            case EmailVerificationStatus.VERIFIED:
                await changePassword();
                break;
            default:
                throw new Error("Unreachable Code");
        }
    }

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

    async function changePassword() {
        if (emailVerificationStatus != EmailVerificationStatus.VERIFIED) {
            setEmailValidityStatus(EmailValidityStatus.INVALID);
            return;
        }

        if (passwordValidityStatus != PasswordValidityStatus.VALID) {
            setPasswordValidityStatus(PasswordValidityStatus.INVALID);
            return;
        }

        try {
            await api.patch(`/api/user/change/password`, {
                email: emailInput.value,
                sessionKey: sessionKey,
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value
            });

            Router.push("/auth/sign-in");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Change password",
                text: `${error}`
            });
        }
    }

    return (
        <div className={css.center}>
            <Card css={{ width: "90%", maxWidth: "500px" }}>
                <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                    <Text css={{
                        fontSize: "1.7em",
                        fontWeight: "bold",
                        margin: 0
                    }}>Change Password</Text>
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
        </div>
    )
};
