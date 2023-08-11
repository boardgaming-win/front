function b64toBlob(b64: string): Blob {
    const byteString = atob(b64.split(',')[1]);
    const mimeString = b64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export {
    b64toBlob
}