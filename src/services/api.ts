import type { DeezerTrackDto, MusicSearchResponse, Track } from "../types/music";

const API_DOMAIN =
  import.meta.env.NEXT_PUBLIC_MUSIC_API_DOMAIN ||
  "https://api.deezer.com";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80";

interface DeezerEnvelope<T> {
  data?: T[];
  total?: number;
  next?: string;
  error?: {
    type: string;
    message: string;
    code: number;
  };
}

const buildUrl = (path: string, params: Record<string, string | number | undefined>) => {
  const url = new URL(`${API_DOMAIN}${path}`);
  url.searchParams.set("output", "jsonp");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const jsonpRequest = <T>(url: string, timeoutMs = 9000): Promise<DeezerEnvelope<T>> =>
  new Promise((resolve, reject) => {
    const callbackName = `sangitDeezer${Date.now()}${Math.round(Math.random() * 10000)}`;
    const separator = url.includes("?") ? "&" : "?";
    const script = document.createElement("script");
    const target = window as unknown as Window & Record<string, (payload: DeezerEnvelope<T>) => void>;

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete target[callbackName];
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Deezer API request timed out"));
    }, timeoutMs);

    target[callbackName] = (payload) => {
      cleanup();
      if (payload.error) {
        reject(new Error(payload.error.message));
        return;
      }
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Deezer API script failed to load"));
    };

    script.src = `${url}${separator}callback=${callbackName}`;
    document.head.appendChild(script);
  });

const toTrack = (track: DeezerTrackDto): Track => {
  const image = track.album.cover_big || track.album.cover_medium || track.album.cover || track.artist.picture_big || track.artist.picture_medium || DEFAULT_IMAGE;

  const artist = {
    id: String(track.artist.id),
    name: track.artist.name,
    image: track.artist.picture_medium || track.artist.picture,
  };

  const album = {
    id: String(track.album.id),
    title: track.album.title || "Single",
    image,
    artist,
    releaseDate: track.album.release_date,
  };

  return {
    id: String(track.id),
    title: track.title_short || track.title,
    duration: Number(track.duration) || 0,
    previewUrl: track.preview,
    audioUrl: track.preview,
    image,
    artist,
    album,
    shareUrl: track.link,
    position: track.rank,
  };
};

const requestTracks = async (path: string, params: Record<string, string | number | undefined>): Promise<MusicSearchResponse> => {
  const data = await jsonpRequest<DeezerTrackDto>(buildUrl(path, params));
  const tracks = (data.data ?? []).map(toTrack).filter((track) => track.audioUrl);

  return {
    tracks,
    total: data.total ?? tracks.length,
  };
};

export const musicApi = {
  discover: (limit = 24) =>
    requestTracks("/chart/0/tracks", {
      limit,
    }),

  search: (query: string, limit = 24) =>
    requestTracks("/search", {
      q: query.trim(),
      limit,
    }),
};
