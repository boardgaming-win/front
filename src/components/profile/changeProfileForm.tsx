import { Card, Text, Input, useInput, Button, Modal } from '@nextui-org/react';
import css from './changeProfileForm.module.css';
import { NameValidityStatus, User } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/functions/util/debounce';
import { debounceDelay } from '@/config/debounceConfig';
import ImageIcon from '../common/imageIcon';
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from '@/functions/util/croppedImage';
import Swal from 'sweetalert2';

function displayNameHelperText(nameValidityStatus: NameValidityStatus): string {
    switch (nameValidityStatus) {
        case NameValidityStatus.INVALID:
        case NameValidityStatus.DUPLICATED:
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

export default function ChangeProfileForm({
    user,
    onChangeNameInput,
    onSubmit
}: {
    user: User,
    onChangeNameInput: (nameInput: string) => Promise<NameValidityStatus>,
    onSubmit: (croppedImage: Blob | null, name: string | null) => Promise<void>
}) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageChanged, setImageChanged] = useState(false);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, []);

    const [imgSrc, setImgSrc] = useState('');
 
    function selectImage() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;

            if (target.files && target.files.length > 0) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setImgSrc(reader.result?.toString() || '');
                });
                reader.readAsDataURL(target.files[0]);
                setChangeImageVisible(true);
            }
        });
        fileInput.click();
    }

    const [changeImageVisible, setChangeImageVisible] = useState(false);
    
    useEffect(() => {
        if (changeImageVisible) {
            const image = document.querySelector('img.reactEasyCrop_Image') as HTMLElement;
            const cropperDiv = document.querySelector('div[data-testid="cropper"]') as HTMLDivElement;
            if (cropperDiv) {
                const widthAndHeight = Math.min(image.clientHeight, image.clientWidth);
                cropperDiv.style.width = `${widthAndHeight}px`;
                cropperDiv.style.height = `${widthAndHeight}px`;
            }
        }
    }, [changeImageVisible]);

    function closeHandler() {
        setChangeImageVisible(false);
    }

    async function cropHandler() {
        try {
            if (croppedAreaPixels) {
                const image = await getCroppedImg(
                    imgSrc,
                    croppedAreaPixels,
                    0
                );
                setCroppedImage(image);
                user.image = (image && URL.createObjectURL(image)) || user.image;
                setImageChanged(true);
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Sign in",
                text: `${e}`  
            });
        }
        closeHandler();
    }

    const nameInput = useInput(user.name);
    const [nameValidityStatus, setNameValidityStatus] = useState(NameValidityStatus.UNCHECKED);

    useEffect(() => {
        if (nameInput.value == user.name) {
            setNameValidityStatus(NameValidityStatus.UNCHECKED);
            return;
        }

        async function setStatus() {
            setNameValidityStatus(await onChangeNameInput(nameInput.value));
        }

        setStatus();
    }, [useDebounce(nameInput.value, debounceDelay)]);

    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        if (nameValidityStatus == NameValidityStatus.VALID || (nameValidityStatus == NameValidityStatus.UNCHECKED && imageChanged == true)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [nameValidityStatus, imageChanged]);

    async function onPress() {
        await onSubmit(imageChanged == true ? croppedImage : null, nameValidityStatus == NameValidityStatus.VALID ? nameInput.value : null);
    }

    return (
        <>
            <Modal
                closeButton
                fullScreen
                aria-labelledby="modal-title"
                open={changeImageVisible}
                onClose={closeHandler}>
                <Modal.Header>
                    <Text b id="modal-title" size="2vh">
                        Crop Image
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ height: "50vh", backgroundColor: "white", padding: 0 }}>
                    <Cropper
                        cropShape="round"
                        image={imgSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat css={{ width: "100%" }} onPress={cropHandler}>
                        Crop
                    </Button>
                </Modal.Footer>
            </Modal>
            <Card css={{ width: "500px", maxWidth: "90vw" }}>
                <Card.Header css={{ justifyContent: "center", boxSizing: "border-box" }}>
                    <Text css={{
                        fontSize: "1.7em",
                        fontWeight: "bold",
                        margin: 0
                    }}>Change profile</Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ boxSizing: "border-box" }}>
                    <div className={css.imageIcon} onClick={() => selectImage()}>
                        <ImageIcon user={user}/>
                    </div>
                    <Text css={{ fontSize: "1.2em", margin: "8px 10px 8px 10px" }}>
                        Name
                    </Text>
                    <Input
                        id="name input"
                        aria-label="name input"
                        clearable
                        initialValue={nameInput.value}
                        onChange={(e) => nameInput.setValue(e.target.value)}
                        type="text"
                        size="xl"/>
                    <Text
                        color="error"
                        css={{ fontSize: "1em", margin: "4px 10px 0px 10px", display: displayNameHelperText(nameValidityStatus) }}>
                        { getNameHelperText(nameValidityStatus) }
                    </Text>
                </Card.Body>
                <Card.Divider />
                <Card.Footer css={{ justifyContent: "center", boxSizing: "border-box" }}>
                    <Button size="lg" css={{ width: "100%", fontSize: "1.2em" }} disabled={buttonDisabled} onPress={onPress}>Change profile</Button>
                </Card.Footer>
            </Card>
        </>
    );
}