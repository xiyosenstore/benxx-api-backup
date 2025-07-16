import http from "http";
export default function generatePayload(res, props) {
    const payload = {
        statusCode: 500,
        statusMessage: "",
        message: "",
        ok: false,
        data: null,
        pagination: null,
    };
    const isOk = (statusCode) => {
        const strStatusCode = statusCode.toString();
        if (strStatusCode.startsWith("4") || strStatusCode.startsWith("5")) {
            return false;
        }
        return true;
    };
    payload.statusCode = res.statusCode;
    payload.statusMessage = http.STATUS_CODES[res.statusCode] || "";
    payload.message = props?.message || "";
    payload.data = props?.data || null;
    payload.pagination = props?.pagination || null;
    payload.ok = isOk(res.statusCode);
    return payload;
}
