import { api } from '@/config/apiConfig';
import { debounceDelay } from '@/config/debounceConfig';
import useDebounce from '@/functions/util/debounce';
import { InputType, EmailVerificationStatus, EmailValidityStatus, EmailCodeValidtyStatus } from '@/types';
import { Input, useInput, Text } from '@nextui-org/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

function getEmailInputDisabled(emailVerificationStatus: EmailVerificationStatus): boolean {
    return emailVerificationStatus == EmailVerificationStatus.VERIFIED;
}

function displayEmailInputHelperText(emailValidityStatus: EmailValidityStatus): string {
    switch (emailValidityStatus) {
        case EmailValidityStatus.DUPLICATED:
        case EmailValidityStatus.INVALID:
        case EmailValidityStatus.NOT_EXISTS:
            return "block";
        default:
            return "none";
    }
}

function getEmailInputHelperText(emailValidityStatus: EmailValidityStatus): string {
    switch (emailValidityStatus) {
        case EmailValidityStatus.DUPLICATED:
            return "Already exists email";
        case EmailValidityStatus.NOT_EXISTS:
            return "Not exists emaill";
        case EmailValidityStatus.INVALID:
            return "Enter valid email";
        default:
            return "";
    }
}

function displayVerificationInput(emailVerificationStatus: EmailVerificationStatus): string {
    switch (emailVerificationStatus) {
        case EmailVerificationStatus.VERIFIED:
            return "none";
        default:
            return "block";
    }
}

function displayVerificationInputHelperText(emailCodeValidityStatus: EmailCodeValidtyStatus): string {
    switch (emailCodeValidityStatus) {
        case EmailCodeValidtyStatus.INCORRECT:
            return "block";
        default:
            return "none";
    }
}

function getVerificationInputHelperText(emailCodeValidityStatus: EmailCodeValidtyStatus): string {
    switch (emailCodeValidityStatus) {
        case EmailCodeValidtyStatus.INCORRECT:
            return "Incorrect code";
        default:
            return "";

    }
}

export default function EmailVerificationForm({
    emailInput,
    emailValidityStatus,
    emailVerificationStatus,
    setEmailValidityStatus,
    emailCodeValidityStatus,
    setEmailCodeValidityStatus,
    sessionKey,
    setEmailVerificationStatus,
    onChangeEmailInput
}: {
    emailInput: InputType,
    emailValidityStatus: EmailValidityStatus,
    emailVerificationStatus: EmailVerificationStatus,
    setEmailValidityStatus: Dispatch<SetStateAction<EmailValidityStatus>>,
    emailCodeValidityStatus: EmailCodeValidtyStatus,
    setEmailCodeValidityStatus: Dispatch<SetStateAction<EmailCodeValidtyStatus>>,
    sessionKey: string,
    setEmailVerificationStatus: Dispatch<SetStateAction<EmailVerificationStatus>>
    onChangeEmailInput: Function
}) {
    useEffect(() => {
        if (!emailInput.value) {
            setEmailValidityStatus(EmailValidityStatus.UNCHECKED);
            return;
        }

        if (!emailInput.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
            setEmailValidityStatus(EmailValidityStatus.INVALID);
            return;
        }

        onChangeEmailInput();
    
        return;
    }, [useDebounce(emailInput.value, debounceDelay)]);

    const verificationInput = useInput("");

    useEffect(() => {
        const checkCode = async () => {
            try {
                const { data } = await api.post(`/api/auth/verification/email/check/code`, {
                    email: emailInput.value,
                    sessionKey: sessionKey,
                    verificationCode: verificationInput.value
                });
                if (data.valid) {
                    setEmailCodeValidityStatus(EmailCodeValidtyStatus.VALID);
                    setEmailVerificationStatus(EmailVerificationStatus.VERIFIED);
                } else {
                    setEmailCodeValidityStatus(EmailCodeValidtyStatus.INCORRECT);
                }
            } catch (error) {
              console.log(error);
            }
        };

        if (!verificationInput.value) {
            setEmailCodeValidityStatus(EmailCodeValidtyStatus.UNCHECKED);
            return;
        }

        checkCode();
    
        return;
    }, [useDebounce(verificationInput.value, debounceDelay)]);
    
    return (
        <>
            <Text css={{ fontSize: "1.2em", margin: "12px 10px 8px 10px" }}>
                Email
            </Text>
            <Input
                id={"email input"}
                clearable={!getEmailInputDisabled(emailVerificationStatus)}
                disabled={getEmailInputDisabled(emailVerificationStatus)}
                value={emailInput.value}
                onChange={(e) => emailInput.setValue(e.target.value)}
                css={{ width: "100%" }}
                aria-label="email input"
                type="text"
                size="xl"
                placeholder="Enter email"/>
            <Text
                color="error"
                css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayEmailInputHelperText(emailValidityStatus) }}>
                { getEmailInputHelperText(emailValidityStatus) }
            </Text>
            <Text css={{ fontSize: "1.2em", margin: "12px 10px 8px 10px", display: displayVerificationInput(emailVerificationStatus) }}>
                Verification
            </Text>
            <Input
                id={"verification input"}
                clearable
                value={verificationInput.value}
                onChange={(e) => verificationInput.setValue(e.target.value)}
                aria-label="verification input"
                css={{ width: "100%", display: displayVerificationInput(emailVerificationStatus) }}
                type="text"
                size="xl"
                placeholder="Verification code"/>
            <Text
                color="error"
                css={{ fontSize: "1em", margin: "8px 10px 8px 10px", display: displayVerificationInputHelperText(emailCodeValidityStatus) }}>
                { getVerificationInputHelperText(emailCodeValidityStatus) }
            </Text>
        </>
    )
};
