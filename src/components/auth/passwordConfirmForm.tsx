import { debounceDelay } from '@/config/debounceConfig';
import useDebounce from '@/functions/util/debounce';
import { InputType, PasswordValidityStatus } from '@/types';
import { Input, Text } from '@nextui-org/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

function displayPasswordHelperText(passwordValidityStatus: PasswordValidityStatus): string {
    switch (passwordValidityStatus) {
        case PasswordValidityStatus.INVALID:
        case PasswordValidityStatus.NOT_EQUAL:
            return "block";
        default:
            return "none";
    }
}

function getPasswordHelperText(passwordValidityStatus: PasswordValidityStatus): string {
    switch (passwordValidityStatus) {
        case PasswordValidityStatus.INVALID:
            return "Invalid password";
        case PasswordValidityStatus.NOT_EQUAL:
            return "Not equal password";
        default:
            return "";
    }
}

function checkPasswordValidity(password: string): boolean {
    return true;
}

export default function PasswordConfirmForm({
    visible,
    passwordInput,
    confirmPasswordInput,
    passwordValidityStatus,
    setPasswordValidityStatus
}: {
    visible: boolean,
    passwordInput: InputType,
    confirmPasswordInput: InputType
    passwordValidityStatus: PasswordValidityStatus,
    setPasswordValidityStatus: Dispatch<SetStateAction<PasswordValidityStatus>>
}) {
    useEffect(() => {
        if (!checkPasswordValidity(passwordInput.value)) {
            setPasswordValidityStatus(PasswordValidityStatus.INVALID);
            return;
        }

        if (!confirmPasswordInput.value) {
            setPasswordValidityStatus(PasswordValidityStatus.UNCHECKED);
            return;
        }

        if (confirmPasswordInput.value == passwordInput.value) {
            setPasswordValidityStatus(PasswordValidityStatus.VALID);
        } else {
            setPasswordValidityStatus(PasswordValidityStatus.NOT_EQUAL);
        }
    }, [useDebounce(passwordInput, debounceDelay), useDebounce(confirmPasswordInput.value, debounceDelay)]);

    return (
        <div style={{ display: visible ? "block" : "none" }}>
            <Text css={{ fontSize: "1.2em", margin: "12px 10px 8px 10px" }}>
                New Password
            </Text>
            <form>
                <Input.Password
                    id={"password input"}
                    css={{ width: "100%" }}
                    value={passwordInput.value}
                    onChange={(e) => passwordInput.setValue(e.target.value)}
                    aria-label="password input"
                    type="password"
                    size="xl"
                    placeholder="Enter password"/>
            </form>
            <Text css={{ fontSize: "1.2em", margin: "12px 10px 8px 10px" }}>
                Confirm password
            </Text>
            <form>
                <Input.Password
                    id={"confirm password input"}
                    css={{ width: "100%" }}
                    value={confirmPasswordInput.value}
                    onChange={(e) => confirmPasswordInput.setValue(e.target.value)}
                    aria-label="confirm password input"
                    type="password"
                    size="xl"
                    placeholder="Enter confirm password"/>
            </form>
            <Text
                color="error"
                css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayPasswordHelperText(passwordValidityStatus) }}>
                { getPasswordHelperText(passwordValidityStatus) }
            </Text> 
       </div>
    );
}