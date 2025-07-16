import { defaultTTL, cache } from "@libs/lruCache.js";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function serverCache(ttl, responseType = "json") {
    return (req, res, next) => {
        const newTTL = ttl ? 1000 * 60 * ttl : defaultTTL;
        const key = path.join(req.originalUrl, "/").replace(/\\/g, "/");
        const cachedData = cache.get(key);
        if (cachedData) {
            if (typeof cachedData === "object") {
                return res.json(cachedData);
            }
            if (typeof cachedData === "string") {
                return res.send(cachedData);
            }
            return res.send(String(cachedData));
        }
        if (responseType === "json") {
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode < 399 && body.ok) {
                    cache.set(key, body, { ttl: newTTL });
                }
                return originalJson(body);
            };
        }
        else {
            const originalSend = res.send.bind(res);
            res.send = (body) => {
                if (res.statusCode < 399) {
                    cache.set(key, body, { ttl: newTTL });
                }
                return originalSend(body);
            };
        }
        next();
    };
}
export function clientCache(maxAge) {
    return (req, res, next) => {
        res.setHeader("Cache-Control", `public, max-age=${maxAge ? maxAge * 60 : 60}`);
        next();
    };
}
