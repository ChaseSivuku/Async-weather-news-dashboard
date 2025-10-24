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

// Chain Promises: weather -> news -> display
function chainPromises(lat: number, lon: number) {
  console.log('[Promise] Starting promise chaining...');
  fetchJson(weatherUrl(lat, lon))
    .then((w) => {
      const cw = w?.current_weather;
      console.log('[Promise] Weather:', `${cw?.temperature}°C`);
      // return news fetch to chain
      return fetchJson(newsUrl(3));
    })
    .then((n) => {
      const posts = n?.posts || [];
      console.log('[Promise] News headlines:');
      posts.forEach((p: any, i: number) => console.log(` - ${i+1}. ${p.title}`));
    })
    .catch((err) => {
      console.error('[Promise] Error:', err?.message || err);
    });
}

// Promise.all() example
function runPromiseAll(lat: number, lon: number) {
  console.log('\n[Promise.all] Running weather + news concurrently...');
  Promise.all([fetchJson(weatherUrl(lat, lon)), fetchJson(newsUrl(5))])
    .then(([w, n]) => {
      const cw = w?.current_weather;
      console.log('[Promise.all] Weather:', `${cw?.temperature}°C`);
      const posts = n?.posts || [];
      console.log('[Promise.all] News titles:', posts.map((p:any) => p.title).join(' | '));
    })
    .catch((err) => console.error('[Promise.all] Error:', err?.message || err));
}

// Promise.race() example
function runPromiseRace(lat: number, lon: number) {
  console.log('\n[Promise.race] Which responds first?');
  Promise.race([fetchJson(weatherUrl(lat, lon)), fetchJson(newsUrl(5))])
    .then((res) => {
      // we don't know shape; try to guess
      if (res?.current_weather) {
        console.log('[Promise.race] Fastest was Weather:', `${res.current_weather.temperature}°C`);
      } else if (res?.posts) {
        console.log('[Promise.race] Fastest was News. First title:', res.posts[0]?.title);
      } else {
        console.log('[Promise.race] Fastest response shape:', Object.keys(res || {}).slice(0,5));
      }
    })
    .catch((err) => console.error('[Promise.race] Error:', err?.message || err));
}

chainPromises(-26.2041, 28.0473);
setTimeout(() => runPromiseAll(-26.2041, 28.0473), 2000);
setTimeout(() => runPromiseRace(-26.2041, 28.0473), 4000);
