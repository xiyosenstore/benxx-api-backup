import { getOrderParam, getPageParam, getQParam, getUrlParam } from "../../../helpers/queryParams.js";
import SamehadakuParser from "../parsers/SamehadakuParser.js";
import samehadakuInfo from "../info/samehadakuInfo.js";
import generatePayload from "../../../helpers/payload.js";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { baseUrl, baseUrlPath } = samehadakuInfo;
const parser = new SamehadakuParser(baseUrl, baseUrlPath);
const samehadakuController = {
    getMainView(req, res, next) {
        try {
            const getViewFile = (filePath) => {
                return path.join(__dirname, "..", "..", "..", "public", "views", filePath);
            };
            res.sendFile(getViewFile("anime-source.html"));
        }
        catch (error) {
            next(error);
        }
    },
    getMainViewData(req, res, next) {
        try {
            const data = samehadakuInfo;
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getHome(req, res, next) {
        try {
            const data = await parser.parseHome();
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getAllGenres(req, res, next) {
        try {
            const data = await parser.parseAllGenres();
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getAllAnimes(req, res, next) {
        try {
            const data = await parser.parseAllAnimes();
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getSchedule(req, res, next) {
        try {
            const data = await parser.parseSchedule();
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getRecentEpisodes(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseRecentAnime(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getOngoingAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const order = getOrderParam(req);
            const { data, pagination } = await parser.parseOngoingAnimes(page, order);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getCompletedAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const order = getOrderParam(req);
            const { data, pagination } = await parser.parseCompletedAnimes(page, order);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getPopularAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parsePopularAnimes(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getMovies(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseMovies(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getBatches(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseBatches(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getSearch(req, res, next) {
        try {
            const q = getQParam(req);
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseSearch(q, page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getGenreAnimes(req, res, next) {
        try {
            const { genreId } = req.params;
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseGenreAnimes(genreId, page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getAnimeDetails(req, res, next) {
        try {
            const { animeId } = req.params;
            const data = await parser.parseAnimeDetails(animeId);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getAnimeEpisode(req, res, next) {
        try {
            const { episodeId } = req.params;
            const originUrl = `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get("host")}`;
            const data = await parser.parseAnimeEpisode(episodeId, originUrl);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getServerUrl(req, res, next) {
        try {
            const { serverId } = req.params;
            const originUrl = `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get("host")}`;
            const data = await parser.parseServerUrl(serverId, originUrl);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getAnimeBatch(req, res, next) {
        try {
            const { batchId } = req.params;
            const data = await parser.parseAnimeBatch(batchId);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getWibuFile(req, res, next) {
        try {
            const url = getUrlParam(req);
            const wibuFile = await parser.parseWibuFile(url);
            res.send(wibuFile);
        }
        catch (error) {
            next(error);
        }
    },
};
export default samehadakuController;
