export function setResponseError(status, message) {
    throw { status, message };
}
