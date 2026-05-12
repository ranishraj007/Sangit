import type { CSSProperties } from "react";
import { useAudio } from "../hooks/useAudio";
import { usePlayerStore } from "../stores/playerStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { formatTime } from "../utils/format";
import { Icon } from "./Icon";
import { TrackArtwork } from "./TrackArtwork";

export const AudioPlayer = () => {
  const { currentTime, duration, volume, seek, setVolume } = useAudio();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const toggleLike = usePlaylistStore((state) => state.toggleLike);
  const isLiked = usePlaylistStore((state) => (currentTrack ? state.isLiked(currentTrack.id) : false));
  const progress = duration ? (currentTime / duration) * 1100 : 0;

  return (
    <footer className="player-shell">
      <div className="flex min-w-0 items-center gap-3">
        {currentTrack ? (
          <>
            <TrackArtwork src={currentTrack.image} alt={currentTrack.title} size="sm" isPlaying={isPlaying} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{currentTrack.title}</p>
              <p className="truncate text-xs text-white/50">{currentTrack.artist.name}</p>
            </div>
            <button
              className={`icon-button h-9 w-9 ${isLiked ? "text-pulse" : ""}`}
              type="button"
              onClick={() => toggleLike(currentTrack)}
              aria-label={isLiked ? "Remove from liked songs" : "Save to liked songs"}
            >
              <Icon name="heart" active={isLiked} className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">No track selected</p>
            <p className="text-xs text-white/50">Pick something from Discover or Search</p>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button className="icon-button h-10 w-10" type="button" onClick={previous} aria-label="Previous track" disabled={!currentTrack}>
            <Icon name="previous" className="h-4 w-4" />
          </button>
          <button className="play-button" type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} disabled={!currentTrack}>
            <Icon name={isPlaying ? "pause" : "play"} className="h-5 w-5" />
          </button>
          <button className="icon-button h-10 w-10" type="button" onClick={next} aria-label="Next track" disabled={!currentTrack}>
            <Icon name="next" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex w-full max-w-2xl items-center gap-3">
          <span className="w-10 text-right text-[11px] text-white/45">{formatTime(currentTime)}</span>
          <input
            aria-label="Seek"
            className="range-control"
            max={duration || 0}
            min="0"
            step="1"
            type="range"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.currentTarget.value))}
            style={{ "--range-progress": `${progress}%` } as CSSProperties}
            disabled={!currentTrack}
          />
          <span className="w-10 text-[11px] text-white/45">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden min-w-40 items-center gap-2 lg:flex">
        <Icon name="volume" className="h-4 w-4 text-white/50" />
        <input
          aria-label="Volume"
          className="range-control"
          max="1"
          min="0"
          step="0.01"
          type="range"
          value={volume}
          onChange={(event) => setVolume(Number(event.currentTarget.value))}
          style={{ "--range-progress": `${volume * 100}%` } as CSSProperties}
        />
      </div>
    </footer>
  );
};
