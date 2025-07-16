import { gotScraping } from 'got-scraping';
import { CookieJar } from 'tough-cookie';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cookiesArray = [
    {
        "name": "cf_clearance",
        "value": "Z8.wwmZqUEiEaCbxYrZ6KEdeSIO4DSGpD8m_CQGp1qc-1752605874-1.2.1.1-feRaYpWKWRaP26LnmPHPn8vVbJr7niG4W10MeGoiyJOL5drtX2THF25tf0AQ9FtsTgtqUbIZZa2D6rhSwGMuj15wOHqRuKT6aQu_SoXgF.50GIP4.tWxEQ5cDeuVMQ7thRr3cq5bCcz8REZDNxf1JtEZQC1GjLhaWEqI.QMAD.XHZEijKFcSEalBPYR_jMg2uB3wFXQYsUNBwiIxZ1rsI1O_OC22FYGME2r7uO5yHEE",
        "domain": ".samehadaku.now",
    },
];
const cookieJar = new CookieJar();
Promise.all(cookiesArray.map((cookie) => {
    const url = `https://${cookie.domain.replace(/^\./, '')}`;
    return cookieJar.setCookie(`${cookie.name}=${cookie.value}`, url);
}));
export async function belloFetch(url, ref, options) {
    const response = await gotScraping({
        url,
        ...options,
        cookieJar,
        headers: {
            'Referer': ref,
            ...options?.headers,
        },
    });
    return response.body;
}
export async function getFinalUrl(url, ref, options) {
    try {
        const response = await gotScraping({
            method: 'HEAD',
            url,
            ...options,
            cookieJar,
            headers: {
                'Referer': ref,
                ...options?.headers,
            },
            followRedirect: false,
            throwHttpErrors: false,
        });
        return response.headers.location || url;
    }
    catch (error) {
        console.error(`Error getting final URL for ${url}:`, error);
        return url;
    }
}
export async function getFinalUrls(urls, ref, config) {
    const { retries = 3, delay = 1000 } = config.retryConfig || {};
    const retryRequest = async (url) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await getFinalUrl(url, ref, config.options);
            }
            catch (error) {
                if (attempt === retries)
                    throw error;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        return '';
    };
    const requests = urls.map((url) => retryRequest(url));
    const responses = await Promise.allSettled(requests);
    return responses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value;
        }
        return '';
    });
}
