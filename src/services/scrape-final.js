// scrape-final.js
(async () => {
  // =================== UPDATE DATA DI SINI SETIAP KALI ERROR ===================
  const USER_AGENT = "GANTI_DENGAN_USER_AGENT_BARU_DARI_BROWSERMU";
  const CF_CLEARANCE_COOKIE = "GANTI_DENGAN_NILAI_COOKIE_CF_CLEARANCE_BARU";
  // ===========================================================================

  try {
    // Ambil URL yang akan di-scrape dari argumen command line
    const urlToScrape = process.argv[2];

    if (!urlToScrape) {
      process.stderr.write('Error: URL harus disediakan sebagai argumen.\n');
      process.exit(1);
    }
    
    // Validasi dasar agar tidak lupa mengganti placeholder
    if (USER_AGENT.includes('GANTI_DENGAN') || CF_CLEARANCE_COOKIE.includes('GANTI_DENGAN')) {
        process.stderr.write('Error: Harap isi User-Agent dan Cookie di dalam scrape-final.js\n');
        process.exit(1);
    }

    const { gotScraping } = await import('got-scraping');
    const { CookieJar } = await import('tough-cookie');

    const cookieJar = new CookieJar();
    const targetDomain = new URL(urlToScrape).hostname;
    await cookieJar.setCookie(`cf_clearance=${CF_CLEARANCE_COOKIE}`, `https://${targetDomain}`);
    
    const response = await gotScraping(urlToScrape, {
      cookieJar,
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome' }],
        operatingSystems: ['windows'],
      },
      headers: { 'User-Agent': USER_AGENT },
      http2: true,
    });

    if (response.statusCode === 200 && !response.body.includes('Just a moment')) {
      process.stdout.write(response.body);
    } else {
      process.stderr.write('Gagal: Masih kena challenge Cloudflare.\n');
      process.exit(1);
    }
  } catch (err) {
    process.stderr.write(`Error fatal di dalam skrip: ${err.message}\n`);
    process.exit(1);
  }
})();