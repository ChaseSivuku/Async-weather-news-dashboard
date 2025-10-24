import * as https from 'https';

const weatherUrl = (lat: number, lon: number) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

const newsUrl = (limit = 5) =>
  `https://dummyjson.com/posts?limit=${limit}`;

function getJsonCallback(url: string, cb: (err: Error | null, data?: any) => void) {
  https.get(url, (res) => {
    let raw = '';
    res.on('data', (chunk) => raw += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        cb(null, parsed);
      } catch (e) {
        cb(e as Error);
      }
    });
  }).on('error', (err) => cb(err));
}

// Demonstrate callback "hell" by nesting dependent calls
function runCallbacks(lat: number, lon: number) {
  console.log('[Callback] Starting callback-based fetch...');

  getJsonCallback(weatherUrl(lat, lon), (err, weatherData) => {
    if (err) {
      console.error('[Callback] Weather error:', err.message);
      return;
    }
    const cw = weatherData?.current_weather;
    console.log(`[Callback] Weather: ${cw?.temperature}°C, wind ${cw?.windspeed} m/s`);

    // nested: after weather, fetch news
    getJsonCallback(newsUrl(5), (err2, newsData) => {
      if (err2) {
        console.error('[Callback] News error:', err2.message);
        return;
      }
      const posts = newsData?.posts || [];
      console.log('[Callback] News headlines:');
      posts.forEach((p: any, i: number) => {
        console.log(` - ${i+1}. ${p.title}`);
        // deeper nesting to simulate callback hell (e.g., fetch details of first post)
        if (i === 0) {
          getJsonCallback(`https://dummyjson.com/posts/${p.id}`, (err3, detail) => {
            if (err3) {
              console.error('[Callback] Post detail error:', err3.message);
              return;
            }
            console.log('[Callback] First post detailed body snippet:', (detail?.body || '').slice(0,80));
          });
        }
      });
    });
  });
}

// Default coordinates: Johannesburg (approx)
runCallbacks(-26.2041, 28.0473);
