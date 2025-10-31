export const getElementRef = (element) => {
    if (element && element.ref) {
        return element.ref;
    }
    return null;
};

export const hasRef = (element) => {
    return element && element.ref !== undefined && element.ref !== null;
};

