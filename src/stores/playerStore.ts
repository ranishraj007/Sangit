import { create } from "zustand";
import type { Track } from "../types/music";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentIndex: number;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}

const findTrackIndex = (queue: Track[], track: Track) => {
  const index = queue.findIndex((item) => item.id === track.id);
  return index >= 0 ? index : 0;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,

  setQueue: (tracks, startIndex = 0) => {
    const safeIndex = Math.min(Math.max(startIndex, 0), Math.max(tracks.length - 1, 0));
    set({
      queue: tracks,
      currentIndex: safeIndex,
      currentTrack: tracks[safeIndex] ?? null,
      isPlaying: Boolean(tracks[safeIndex]),
    });
  },

  playTrack: (track, queue) => {
    const nextQueue = queue?.length ? queue : get().queue.length ? get().queue : [track];
    set({
      currentTrack: track,
      queue: nextQueue,
      currentIndex: findTrackIndex(nextQueue, track),
      isPlaying: true,
    });
  },

  togglePlay: () => {
    if (get().currentTrack) {
      set((state) => ({ isPlaying: !state.isPlaying }));
    }
  },

  pause: () => set({ isPlaying: false }),

  next: () => {
    const { queue, currentIndex } = get();
    if (!queue.length) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    set({
      currentIndex: nextIndex,
      currentTrack: queue[nextIndex],
      isPlaying: true,
    });
  },

  previous: () => {
    const { queue, currentIndex } = get();
    if (!queue.length) return;
    const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({
      currentIndex: previousIndex,
      currentTrack: queue[previousIndex],
      isPlaying: true,
    });
  },
}));
