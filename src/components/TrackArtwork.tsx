interface TrackArtworkProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  isPlaying?: boolean;
}

const sizeClass = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "aspect-square w-full",
};

export const TrackArtwork = ({ src, alt, size = "md", isPlaying = false }: TrackArtworkProps) => (
  <div className={`${sizeClass[size]} overflow-hidden rounded-lg bg-white/10 shadow-glow`}>
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover transition duration-500 ${isPlaying ? "scale-105 saturate-125" : "scale-100"}`}
      loading="lazy"
    />
  </div>
);
