import React, { useEffect, useState } from "react";
import css from "./signinForm.module.css"
import { Card, Text, Input, Button, useInput, Spacer, Grid } from "@nextui-org/react";
import Link from "next/link";
import { api } from "@/config/apiConfig";
import useDebounce from "@/functions/util/debounce";
import Router from "next/router";
import { debounceDelay } from "@/config/debounceConfig";
import { EmailValidityStatus } from "@/types";

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

export default function SigninForm() {
    const emailInput = useInput("");
    const [emailInputValidity, setEmailValidityStatus] = useState(EmailValidityStatus.UNCHECKED);

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

    return (
        <div className={css.center}>
            <Card css={{ width: "500px", maxWidth: "90vw" }}>
                <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                    <Text css={{
                        fontSize: "1.7em",
                        fontWeight: "bold",
                        margin: 0
                    }}>Sign in</Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ boxSizing: "border-box" }}>
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
                        placeholder="Enter email"/>
                    <Text
                        color="error"
                        css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayEmailHelperText(emailInputValidity) }}>
                        { getEmailHelperText(emailInputValidity) }
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
                        css={{width: "100%"}}
                        value={passwordInput.value}
                        onKeyUp={(e) => signin(e)}
                        onChange={(e) => passwordInput.setValue(e.target.value)}
                        type="password"
                        size="xl"
                        placeholder="Enter password"/>
                    <Text
                        color="error"
                        css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: signinHelperText.value ? "block" : "none" }}>
                        { signinHelperText.value }
                    </Text>
                </Card.Body>
                <Card.Divider />
                <Card.Footer css={{ justifyContent: "center", boxSizing: "border-box" }}>
                    <Button size="lg" css={{ width: "100%", fontSize: "1.2em" }} onPress={signin}>Sign in</Button>
                </Card.Footer>
            </Card>
            <Spacer y={1} />
            <Text css={{ margin: "0" }}> New to BoardGaming? <Link href="/auth/sign-up" className={css.link}>Create an account</Link> </Text>
        </div>
    )
};
  