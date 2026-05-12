# Sangit

Sangit is a simple music player web app built with React, TypeScript, Tailwind CSS, and Zustand.

The app works like a lite music streaming player. Users can discover songs, search music, play/pause tracks, control volume, seek through the track, move to next/previous songs, and save liked songs in the browser.

## Music API

Sangit uses the free Deezer API as the music data source.

The Deezer public API provides 30-second music preview clips. Because of that, the app plays preview audio only, not full songs.

## Features

- Music discovery
- Search songs from Deezer
- 30-second MP3 preview playback
- Play, pause, next, and previous controls
- Custom progress seeker
- Volume control
- Liked songs saved in local storage
- Responsive design for desktop and mobile

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Zustand
- Deezer Free API

## Deployment

The project is hosted on Vercel.

It is deployed using a personal Vercel account.

## Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_MUSIC_API_DOMAIN=https://api.deezer.com
```

## Run Locally

```bash
pnpm install
pnpm dev
```
