import * as https from 'https';

const weatherUrl = (lat: number, lon: number) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

const newsUrl = (limit = 5) =>
  `https://dummyjson.com/posts?limit=${limit}`;

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runAsyncAwait(lat: number, lon: number) {
  console.log('[Async/Await] Starting async/await version...');
  try {
    const weather = await fetchJson(weatherUrl(lat, lon));
    const cw = weather?.current_weather;
    console.log('[Async/Await] Weather:', `${cw?.temperature}°C, wind ${cw?.windspeed} m/s`);

    const news = await fetchJson(newsUrl(5));
    const posts = news?.posts || [];
    console.log('[Async/Await] News headlines:');
    posts.forEach((p: any, i: number) => console.log(` - ${i+1}. ${p.title}`));

    // run concurrent example using Promise.all
    const [w2, n2] = await Promise.all([fetchJson(weatherUrl(lat, lon)), fetchJson(newsUrl(2))]);
    console.log('[Async/Await] (Promise.all) Combined result preview:');
    console.log('  - Weather temp:', w2?.current_weather?.temperature);
    console.log('  - News titles:', (n2?.posts || []).map((p:any)=>p.title).join(' | '));
  } catch (err: any) {
    console.error('[Async/Await] Error caught:', err?.message || err);
  }
}

runAsyncAwait(-26.2041, 28.0473);
