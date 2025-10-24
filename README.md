# Async Weather & News Dashboard

This project demonstrates three styles of asynchronous programming in Node.js + TypeScript:

- Callback-based implementation (`src/callbackVersion.ts`)
- Promise-based implementation (`src/promiseVersion.ts`)
- Async/Await implementation (`src/asyncAwaitVersion.ts`)

It fetches current weather (Open-Meteo API) and news headlines (DummyJSON Posts API).

## Quick setup

1. Install Node.js (v14+ recommended).
2. In the project directory run:

```bash
npm install
```

This will install `typescript` and `ts-node` (devDependencies). If you prefer global installs, you can run `npm i -g ts-node typescript`.

## Run

Use the npm scripts to run each version:

```bash
npm run callback    # runs callbackVersion.ts
npm run promise     # runs promiseVersion.ts
npm run async       # runs asyncAwaitVersion.ts
```

## APIs used

- Weather: Open-Meteo — `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`
- News: DummyJSON Posts — `https://dummyjson.com/posts?limit=5`

No API keys required.

## Files

- `src/callbackVersion.ts` — Uses Node `https` with callbacks (demonstrates nested callbacks).
- `src/promiseVersion.ts` — Wraps `https` in Promises; demonstrates `.then()` chaining, `Promise.all()`, `Promise.race()`.
- `src/asyncAwaitVersion.ts` — Shows `async/await` with `try..catch`.
- `package.json`, `tsconfig.json`, `README.md`

## Sample output (your console)

Callback version:
```
[Callback] Weather: 15.3°C, wind 3.4 m/s
[Callback] News headlines:
 - Post 1: Title example
 - Post 2: Title example
```

Promise version (Promise.all):
```
[Promise.all] Weather: 15.3°C
[Promise.all] News: Post 1, Post 2, Post 3
```

Async/Await version:
```
[Async/Await] Weather: 15.3°C
[Async/Await] News headlines:
 - ...
```

## Notes / Learning outcomes

- Compare readability: callbacks → promises → async/await.
- `Promise.all()` runs requests concurrently; `Promise.race()` returns the fastest.
- Error handling strategies differ: callbacks use error-first callbacks, promises use `.catch()`, async/await uses `try..catch`.

## Troubleshooting

- If `ts-node` isn't found, install it globally: `npm i -g ts-node typescript` or run `npx ts-node src/asyncAwaitVersion.ts`.
- If you want to compile to JS, run `npm run build` then `node dist/...`.

