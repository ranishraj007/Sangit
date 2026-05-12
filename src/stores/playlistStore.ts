import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track } from "../types/music";

interface PlaylistState {
  likedTracks: Track[];
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      likedTracks: [],
      toggleLike: (track) => {
        const exists = get().likedTracks.some((item) => item.id === track.id);
        set({
          likedTracks: exists
            ? get().likedTracks.filter((item) => item.id !== track.id)
            : [track, ...get().likedTracks],
        });
      },
      isLiked: (trackId) => get().likedTracks.some((track) => track.id === trackId),
    }),
    {
      name: "sangit-liked-tracks",
      version: 1,
    },
  ),
);
