import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayerStore } from "../stores/playerStore";

export const useAudio = () => {
  const audio = useMemo(() => new Audio(), []);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const pause = usePlayerStore((state) => state.pause);
  const next = usePlayerStore((state) => state.next);
  const lastTrackId = useRef<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.82);

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    if (!currentTrack) {
      audio.pause();
      lastTrackId.current = null;
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    if (lastTrackId.current !== currentTrack.id) {
      audio.src = currentTrack.audioUrl;
      audio.load();
      lastTrackId.current = currentTrack.id;
      setCurrentTime(0);
    }

    if (isPlaying) {
      void audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [audio, currentTrack, isPlaying, pause]);

  useEffect(() => {
    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : currentTrack?.duration ?? 0);
    const handleEnded = () => next();

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [audio, currentTrack?.duration, next]);

  const seek = (seconds: number) => {
    const nextTime = Math.min(Math.max(seconds, 0), duration || currentTrack?.duration || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const setVolume = (nextVolume: number) => {
    setVolumeState(Math.min(Math.max(nextVolume, 0), 1));
  };

  return {
    currentTime,
    duration: duration || currentTrack?.duration || 0,
    volume,
    seek,
    setVolume,
  };
};
