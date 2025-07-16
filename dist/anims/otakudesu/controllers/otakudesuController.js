import { getPageParam, getQParam } from "../../../helpers/queryParams.js";
import OtakudesuParser from "../parsers/OtakudesuParser.js";
import otakudesuInfo from "../info/otakudesuInfo.js";
import generatePayload from "../../../helpers/payload.js";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { baseUrl, baseUrlPath } = otakudesuInfo;
const parser = new OtakudesuParser(baseUrl, baseUrlPath);
const otakudesuController = {
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
            const data = otakudesuInfo;
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
    async getSchedule(req, res, next) {
        try {
            const data = await parser.parseSchedule();
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
    async getAllGenres(req, res, next) {
        try {
            const data = await parser.parseAllGenres();
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getOngoingAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseOngoingAnimes(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getCompletedAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const { data, pagination } = await parser.parseCompletedAnimes(page);
            res.json(generatePayload(res, { data, pagination }));
        }
        catch (error) {
            next(error);
        }
    },
    async getSearch(req, res, next) {
        try {
            const q = getQParam(req);
            const data = await parser.parseSearch(q);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getGenreAnimes(req, res, next) {
        try {
            const page = getPageParam(req);
            const { genreId } = req.params;
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
            const data = await parser.parseAnimeEpisode(episodeId);
            res.json(generatePayload(res, { data }));
        }
        catch (error) {
            next(error);
        }
    },
    async getServerUrl(req, res, next) {
        try {
            const { serverId } = req.params;
            const data = await parser.parseServerUrl(serverId);
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
};
export default otakudesuController;
