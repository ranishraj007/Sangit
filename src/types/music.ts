export interface Artist {
  id: string;
  name: string;
  image?: string;
  website?: string;
}

export interface Album {
  id: string;
  title: string;
  image: string;
  artist: Artist;
  releaseDate?: string;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  previewUrl: string;
  audioUrl: string;
  image: string;
  artist: Artist;
  album: Album;
  shareUrl?: string;
  position?: number;
}

export interface MusicSearchResponse {
  tracks: Track[];
  total: number;
}

export interface DeezerArtistDto {
  id: number;
  name: string;
  picture?: string;
  picture_medium?: string;
  picture_big?: string;
  tracklist?: string;
  type?: "artist";
}

export interface DeezerAlbumDto {
  id: number;
  title: string;
  cover?: string;
  cover_medium?: string;
  cover_big?: string;
  release_date?: string;
  tracklist?: string;
  type?: "album";
}

export interface DeezerTrackDto {
  id: number;
  title: string;
  title_short?: string;
  duration: number;
  preview: string;
  link?: string;
  rank?: number;
  explicit_lyrics?: boolean;
  artist: DeezerArtistDto;
  album: DeezerAlbumDto;
  type?: "track";
}
