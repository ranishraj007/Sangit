import type { ReactElement } from "react";

interface IconProps {
  name: "home" | "search" | "library" | "menu" | "close" | "play" | "pause" | "previous" | "next" | "heart" | "volume";
  active?: boolean;
  className?: string;
}

export const Icon = ({ name, active = false, className = "h-5 w-5" }: IconProps) => {
  const stroke = active ? "currentColor" : "currentColor";
  const fill = active && name === "heart" ? "currentColor" : "none";

  const paths: Record<IconProps["name"], ReactElement> = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    library: (
      <>
        <path d="M5 4v16" />
        <path d="M10 4v16" />
        <path d="m15 5 4 14" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <path d="M8 5v14" />
        <path d="M16 5v14" />
      </>
    ),
    previous: (
      <>
        <path d="M19 5v14L8 12z" fill="currentColor" stroke="none" />
        <path d="M5 5v14" />
      </>
    ),
    next: (
      <>
        <path d="M5 5v14l11-7z" fill="currentColor" stroke="none" />
        <path d="M19 5v14" />
      </>
    ),
    heart: (
      <path
        d="M20.2 5.8a5 5 0 0 0-7.1 0L12 6.9l-1.1-1.1a5 5 0 1 0-7.1 7.1L12 21l8.2-8.1a5 5 0 0 0 0-7.1z"
        fill={fill}
      />
    ),
    volume: (
      <>
        <path d="M4 9v6h4l5 4V5L8 9z" />
        <path d="M17 9a4 4 0 0 1 0 6" />
        <path d="M19.5 6.5a8 8 0 0 1 0 11" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
};
