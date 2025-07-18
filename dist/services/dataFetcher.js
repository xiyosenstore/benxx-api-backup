import animeConfig from '../configs/animeConfig.js'; // pastikan path-nya sesuai

async function _internalFetch(url, ref, options = {}) {
  const { userAgent, cfCookie } = getLatestCredentials();
  if (!userAgent || !cfCookie || userAgent.includes('GANTI_DENGAN') || cfCookie.includes('GANTI_DENGAN')) {
    throw new Error('Harap isi userAgent dan cfCookie yang valid di dalam src/credentials.json');
  }

  const retries = 3;
  let lastError = null;

  const isCloudflareProtected = url.includes(new URL(animeConfig.baseUrl.samehadaku).hostname);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const cookieJar = new CookieJar();
      const targetDomain = new URL(url).hostname;
      await cookieJar.setCookie(`cf_clearance=${cfCookie}`, `https://${targetDomain}`);

      // Kalau bukan domain Cloudflare, langsung fetch biasa
      if (!isCloudflareProtected) {
        return await gotScraping(url, {
          responseType: options.responseType || 'text',
          cookieJar,
          http2: true,
          headerGeneratorOptions: options.headerGeneratorOptions,
          headers: {
            'User-Agent': userAgent,
            'Referer': ref,
            ...options.headers,
          },
          method: options.method,
          body: options.form ? new URLSearchParams(options.form) : undefined,
        });
      }

      // Untuk domain Cloudflare: challenge check dulu
      const resCheck = await gotScraping(url, {
        responseType: 'text',
        cookieJar,
        http2: true,
        headerGeneratorOptions: options.headerGeneratorOptions,
        headers: {
          'User-Agent': userAgent,
          'Referer': ref,
          ...options.headers,
        },
        method: options.method,
        body: options.form ? new URLSearchParams(options.form) : undefined,
      });

      const bodyText = typeof resCheck.body === 'string' ? resCheck.body : resCheck.body.toString();

      if (resCheck.statusCode === 200 && !bodyText.includes('Just a moment')) {
        return await gotScraping(url, {
          responseType: options.responseType || 'text',
          cookieJar,
          http2: true,
          headerGeneratorOptions: options.headerGeneratorOptions,
          headers: {
            'User-Agent': userAgent,
            'Referer': ref,
            ...options.headers,
          },
          method: options.method,
          body: options.form ? new URLSearchParams(options.form) : undefined,
        });
      }

      lastError = new Error(`Kena challenge Cloudflare di percobaan ke-${attempt}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error(`Gagal fetch setelah ${retries} percobaan. Error: ${lastError?.message}`);
}
