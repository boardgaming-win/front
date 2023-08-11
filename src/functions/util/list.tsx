function removeDuplicate(arr: Array<any>, key: string) {
    return Array.from(new Set(arr.map(el => el[key]))).map(obj_key => arr.find(obj => obj[key] == obj_key));
};

export {
    removeDuplicate
};