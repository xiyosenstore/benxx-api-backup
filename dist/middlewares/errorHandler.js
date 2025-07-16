import generatePayload from "../helpers/payload.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function errorHandler(err, req, res, next) {
    if (typeof err.status === "number") {
        return res.status(err.status).json(generatePayload(res, { message: err.message }));
    }
    res.status(500).json(generatePayload(res, { message: err.message }));
}
