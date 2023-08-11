import { debounceDelay } from '@/config/debounceConfig';
import useDebounce from '@/functions/util/debounce';
import { InputType, NameValidityStatus } from '@/types';
import { Input, Text } from '@nextui-org/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

function displayNameHelperText(nameValidityStatus: NameValidityStatus): string {
    switch (nameValidityStatus) {
        case NameValidityStatus.DUPLICATED:
        case NameValidityStatus.INVALID:
            return "block";
        default:
            return "none";
    }
}

function getNameHelperText(nameValidityStatus: NameValidityStatus): string {
    switch (nameValidityStatus) {
        case NameValidityStatus.DUPLICATED:
            return "Already exists name";
        case NameValidityStatus.INVALID:
            return "Invalid name";
        default:
            return "";
    }
}

function getNameVisible(visible: boolean): string {
    if (visible) {
        return "block";
    } else {
        return "none";
    }
}

export default function NameVerificationForm({
    visible,
    nameInput,
    nameValidityStatus,
    setNameValidityStatus,
    onChangeNameInput
}: {
    visible: boolean,
    nameInput: InputType,
    nameValidityStatus: NameValidityStatus,
    setNameValidityStatus: Dispatch<SetStateAction<NameValidityStatus>>
    onChangeNameInput: Function
}) {

    useEffect(() => {
        if (!nameInput.value) {
            setNameValidityStatus(NameValidityStatus.UNCHECKED);
            return;
        }

        onChangeNameInput();
    
        return;
    }, [useDebounce(nameInput.value, debounceDelay)]);
    
    return (
        <div style={{ display: getNameVisible(visible) }}>
            <Text css={{ fontSize: "1.2em", margin: "8px 10px 8px 10px" }}>
                Name
            </Text>
            <Input
                id={"name input"}
                clearable
                aria-label="name input"
                css={{ width: "100%" }}
                onChange={(e) => nameInput.setValue(e.target.value)}
                autoComplete="false"
                type="text"
                size="xl"
                placeholder="Enter name"/>
            <Text
                color="error"
                css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayNameHelperText(nameValidityStatus) }}>
                { getNameHelperText(nameValidityStatus) }
            </Text>
        </div>
    )
};
