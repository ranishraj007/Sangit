import { useEffect, useMemo, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { Icon } from "./components/Icon";
import { TrackArtwork } from "./components/TrackArtwork";
import { TrackRow } from "./components/TrackRow";
import { musicApi } from "./services/api";
import { usePlayerStore } from "./stores/playerStore";
import { usePlaylistStore } from "./stores/playlistStore";
import type { Track } from "./types/music";

type View = "home" | "search" | "library";

const navItems: Array<{ id: View; label: string; icon: "home" | "search" | "library" }> = [
  { id: "home", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
  { id: "library", label: "Your Library", icon: "library" },
];

const useDebouncedValue = (value: string, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
};

const Sidebar = ({ activeView, onChange }: { activeView: View; onChange: (view: View) => void }) => (
  <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-white/10 bg-black/20 px-5 py-6 backdrop-blur-2xl lg:flex">
    <div>
      <p className="text-2xl font-black tracking-normal text-white">Sangit</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-pulse/80">Lite streaming</p>
    </div>
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <button
          className={`nav-button ${activeView === item.id ? "nav-button-active" : ""}`}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          <Icon name={item.icon} className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

const MobileNav = ({ activeView, onChange }: { activeView: View; onChange: (view: View) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (view: View) => {
    onChange(view);
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu lg:hidden">
      <button
        className="mobile-menu-toggle"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <Icon name={isOpen ? "close" : "menu"} className="h-5 w-5" />
      </button>

      {isOpen && (
        <nav className="mobile-menu-panel" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button
              className={`mobile-menu-item ${activeView === item.id ? "mobile-menu-item-active" : ""}`}
              key={item.id}
              type="button"
              onClick={() => handleChange(item.id)}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

const DiscoverCard = ({ track, queue }: { track: Track; queue: Track[] }) => {
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
    <article className="discover-card">
      <button className="group block w-full text-left" type="button" onClick={handlePlay}>
        <TrackArtwork src={track.image} alt={track.title} size="lg" isPlaying={active && isPlaying} />
        <div className="mt-3 min-w-0">
          <p className={`truncate text-sm font-bold ${active ? "text-pulse" : "text-white"}`}>{track.title}</p>
          <p className="truncate text-xs text-white/48">{track.artist.name}</p>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <button className="play-chip" type="button" onClick={handlePlay} aria-label={active && isPlaying ? "Pause" : "Play"}>
          <Icon name={active && isPlaying ? "pause" : "play"} className="h-4 w-4" />
        </button>
        <button
          className={`icon-button h-9 w-9 ${isLiked ? "text-pulse" : ""}`}
          type="button"
          onClick={() => toggleLike(track)}
          aria-label={isLiked ? "Remove from liked songs" : "Save to liked songs"}
        >
          <Icon name="heart" active={isLiked} className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

const EmptyState = ({ title, body }: { title: string; body: string }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
    <p className="text-lg font-bold text-white">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">{body}</p>
  </div>
);

function App() {
  const [activeView, setActiveView] = useState<View>("home");
  const [discoverTracks, setDiscoverTracks] = useState<Track[]>([]);
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState("");
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query);
  const likedTracks = usePlaylistStore((state) => state.likedTracks);

  useEffect(() => {
    let cancelled = false;
    setLoadingDiscover(true);
    musicApi
      .discover()
      .then(({ tracks }) => {
        if (!cancelled) setDiscoverTracks(tracks);
      })
      .catch(() => {
        if (!cancelled) setError("Deezer is not responding. Check NEXT_PUBLIC_MUSIC_API_DOMAIN in .env.local.");
      })
      .finally(() => {
        if (!cancelled) setLoadingDiscover(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setSearchTracks([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    musicApi
      .search(trimmedQuery)
      .then(({ tracks }) => {
        if (!cancelled) setSearchTracks(tracks);
      })
      .catch(() => {
        if (!cancelled) setSearchTracks([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSearch(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const visibleTracks = useMemo(() => {
    if (activeView === "library") return likedTracks;
    if (activeView === "search") return searchTracks;
    return discoverTracks;
  }, [activeView, discoverTracks, likedTracks, searchTracks]);

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="app-background" />
      <div className="relative flex min-h-screen pb-36 lg:pb-28">
        <Sidebar activeView={activeView} onChange={setActiveView} />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <header className="glass-panel mb-6 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pulse">Sangit</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-5xl">
                {activeView === "home" && "Discover"}
                {activeView === "search" && "Search"}
                {activeView === "library" && "Your Library"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">
                {activeView === "home" && "Independent tracks with fast playback, instant queueing, and a focused listening surface."}
                {activeView === "search" && "Find tracks, artists, and albums from Deezer as you type."}
                {activeView === "library" && "Liked songs persist in this browser and remain ready for playback."}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
              {visibleTracks.length} tracks
            </div>
          </header>

          {error && <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

          {activeView === "home" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Popular now</h2>
                {loadingDiscover && <span className="text-sm text-white/45">Loading</span>}
              </div>
              {discoverTracks.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {discoverTracks.map((track) => (
                    <DiscoverCard key={track.id} track={track} queue={discoverTracks} />
                  ))}
                </div>
              ) : (
                !loadingDiscover && <EmptyState title="No tracks loaded" body="Check the Deezer API domain in .env.local and refresh the app." />
              )}
            </section>
          )}

          {activeView === "search" && (
            <section>
              <label className="search-shell">
                <Icon name="search" className="h-5 w-5 text-white/45" />
                <input
                  autoComplete="off"
                  className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/35"
                  placeholder="Search songs, artists, albums"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
              </label>
              <div className="mt-5 space-y-2">
                {loadingSearch && <p className="px-2 text-sm text-white/50">Searching</p>}
                {!loadingSearch && !query.trim() && <EmptyState title="Start typing" body="Results appear here with a short debounce to keep the interface responsive." />}
                {!loadingSearch &&
                  query.trim() &&
                  searchTracks.map((track, index) => <TrackRow key={track.id} track={track} queue={searchTracks} index={index} />)}
                {!loadingSearch && query.trim() && !searchTracks.length && <EmptyState title="No matches" body="Try a different artist, song name, or album." />}
              </div>
            </section>
          )}

          {activeView === "library" && (
            <section className="space-y-2">
              {likedTracks.length ? (
                likedTracks.map((track, index) => <TrackRow key={track.id} track={track} queue={likedTracks} index={index} />)
              ) : (
                <EmptyState title="No liked songs yet" body="Save tracks from Discover or Search and they will stay here across reloads." />
              )}
            </section>
          )}
        </main>
      </div>
      <MobileNav activeView={activeView} onChange={setActiveView} />
      <AudioPlayer />
    </div>
  );
}

export default App;
