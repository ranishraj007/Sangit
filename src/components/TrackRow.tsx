import type { Track } from "../types/music";
import { usePlayerStore } from "../stores/playerStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { formatTime } from "../utils/format";
import { Icon } from "./Icon";
import { TrackArtwork } from "./TrackArtwork";

interface TrackRowProps {
  track: Track;
  queue: Track[];
  index?: number;
}

export const TrackRow = ({ track, queue, index }: TrackRowProps) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const toggleLike = usePlaylistStore((state) => state.toggleLike);
  const isLiked = usePlaylistStore((state) => state.isLiked(track.id));
  const active = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (active) {
      togglePlay();
      return;
    }
    playTrack(track, queue);
  };

  return (
    <div className={`track-row group ${active ? "border-pulse/30 bg-pulse/10" : "border-white/5 bg-white/[0.035]"}`}>
      <span className="hidden w-7 text-center text-sm text-white/40 sm:block">{index !== undefined ? index + 1 : ""}</span>
      <button className="icon-button h-10 w-10 shrink-0" type="button" onClick={handlePlay} aria-label={active && isPlaying ? "Pause" : "Play"}>
        <Icon name={active && isPlaying ? "pause" : "play"} className="h-4 w-4" />
      </button>
      <TrackArtwork src={track.image} alt={track.title} size="sm" isPlaying={active && isPlaying} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${active ? "text-pulse" : "text-white"}`}>{track.title}</p>
        <p className="truncate text-xs text-white/52">{track.artist.name}</p>
      </div>
      <p className="hidden min-w-0 flex-1 truncate text-sm text-white/45 md:block">{track.album.title}</p>
      <span className="hidden text-sm text-white/40 sm:inline">{formatTime(track.duration)}</span>
      <button
        className={`icon-button h-10 w-10 shrink-0 ${isLiked ? "text-pulse" : ""}`}
        type="button"
        onClick={() => toggleLike(track)}
        aria-label={isLiked ? "Remove from liked songs" : "Save to liked songs"}
      >
        <Icon name="heart" active={isLiked} className="h-4 w-4" />
      </button>
    </div>
  );
};
