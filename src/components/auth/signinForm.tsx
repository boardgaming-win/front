import React, { useEffect, useState } from "react";
import css from "./signinForm.module.css"
import { Card, Text, Input, Button, useInput, Spacer, Grid } from "@nextui-org/react";
import Link from "next/link";
import { api } from "@/config/apiConfig";
import useDebounce from "@/functions/util/debounce";
import Router from "next/router";
import { debounceDelay } from "@/config/debounceConfig";
import { EmailValidityStatus, User } from "@/types";
import GoogleButton from "../button/googleButton";

function displayEmailHelperText(emailInputValidity: EmailValidityStatus): string {
    switch (emailInputValidity) {
        case EmailValidityStatus.INVALID:
        case EmailValidityStatus.DUPLICATED:
        case EmailValidityStatus.NOT_EXISTS:
            return "block";
        default:
            return "none";
    }
}

function getEmailHelperText(emailInputValidity: EmailValidityStatus): string {
    switch (emailInputValidity) {
        case EmailValidityStatus.INVALID:
            return "Enter valid email";
        default:
            return "";
    }
}

export default function SigninForm({
    user
}: {
    user?: User
}) {
    const emailInput = useInput("");
    const [emailInputValidity, setEmailValidityStatus] = useState(EmailValidityStatus.UNCHECKED);
    const [isSignin, setIsSignin] = useState(false);

    useEffect(() => {
        if (!emailInput.value) {
            setEmailValidityStatus(EmailValidityStatus.UNCHECKED);
        } else if (!emailInput.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
            setEmailValidityStatus(EmailValidityStatus.INVALID);
        } else {
            setEmailValidityStatus(EmailValidityStatus.VALID);
        }
    
        return;
    }, [useDebounce(emailInput.value, debounceDelay)]);

    const passwordInput = useInput("");
    const signinHelperText = useInput("");

    async function signin(e: any) {
        if (!(e.type == "press" || (e.type == "keyup" && e.key == "Enter"))) {
            return;
        }

        try {
            if (user) {
                await api.delete("/api/auth");
            }

            await api.post("/api/auth", {
                email: emailInput.value,
                password: passwordInput.value
            });

            Router.push("/");
        } catch (err) {
            passwordInput.setValue("");
            signinHelperText.setValue("Incorrect email or password");
        }
    };

    function accountSignin() {
        setTimeout(() => {
            setIsSignin(true);
        }, 100);
    }

    async function guestSignin() {
        try {
            if (user) {
                await api.delete("/api/auth");
            }

            await api.post("/api/auth/guest");

            Router.push("/");
        } catch (err) {
            passwordInput.setValue("");
            signinHelperText.setValue("Incorrect email or password");
        }
    }

    function googleSignin() {
        process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_SIGN_IN && Router.push(process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_SIGN_IN);
    }

    if (isSignin) {
        return (
            <div className={css.center}>
                <div style={{ width: "90%", maxHeight: "500px", textAlign: "center" }}>
                    <Card>
                        <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                            <Text css={{
                                fontSize: "150%",
                                fontWeight: "bold",
                                margin: 0
                            }}>Sign in</Text>
                        </Card.Header>
                        <Card.Body css={{ boxSizing: "border-box" }}>
                            <GoogleButton onClick={googleSignin}/>
                            <Spacer y={1}/>
                            <Card.Divider y={0.5}>or</Card.Divider>
                            <Grid css={{ margin: "8px 10px 8px 10px" }}>
                                <Text css={{ fontSize: "1.2em", margin: "0" }}>
                                    Email
                                </Text>
                            </Grid>
                            <Input
                                id="email input"
                                aria-label="email input"
                                clearable
                                value={emailInput.value}
                                onChange={(e) => emailInput.setValue(e.target.value)}
                                type="text"
                                size="xl"
                                placeholder="Enter email" />
                            <Text
                                color="error"
                                css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayEmailHelperText(emailInputValidity) }}>
                                {getEmailHelperText(emailInputValidity)}
                            </Text>
                            <Grid justify="space-between" css={{ display: "flex", margin: "8px 10px 8px 10px" }}>
                                <Text css={{ fontSize: "1.2em", margin: "0" }}>
                                    Password
                                </Text>
                                <Text css={{ fontSize: "1.2em", margin: "0" }}>
                                    <Link href="/auth/change-password" className={css.link}>
                                        Forgot password?
                                    </Link>
                                </Text>
                            </Grid>
                            <Input.Password
                                id="password input"
                                aria-label="password input"
                                css={{ width: "100%" }}
                                value={passwordInput.value}
                                onKeyUp={(e) => signin(e)}
                                onChange={(e) => passwordInput.setValue(e.target.value)}
                                type="password"
                                size="xl"
                                placeholder="Enter password" />
                            <Text
                                color="error"
                                css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: signinHelperText.value ? "block" : "none" }}>
                                {signinHelperText.value}
                            </Text>
                        </Card.Body>
                        <Card.Footer css={{ justifyContent: "center", boxSizing: "border-box", flexDirection: "column" }}>
                            <Button size="lg" css={{ width: "100%", fontSize: "120%" }} onPress={signin}>Sign in</Button>
                            <Spacer y={1} />
                            <Text css={{ margin: "0" }}> New to BoardGaming? <Link href="/auth/sign-up" className={css.link}>Create an account</Link></Text>
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        );
    } else {
        return (
            <div className={css.center}>
                <Card css={{ width: "90%", maxWidth: "500px" }}>
                    <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                        <Text css={{
                            fontSize: "200%",
                            fontWeight: "bold",
                            margin: 0
                        }}>Sign in</Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ boxSizing: "border-box" }}>
                        <Button size="lg" css={{ width: "100%", fontSize: "120%" }} onPress={accountSignin}>Sign in</Button>
                        <Spacer y={0.5}/>
                        <Button size="lg" css={{ width: "100%", fontSize: "120%" }} color="secondary" onPress={guestSignin}>Guest</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
};
  