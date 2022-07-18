import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SongCard } from "./SongCard";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/SongCard",
  component: SongCard,
} as ComponentMeta<typeof SongCard>;

const artists = [
  {
    id: "f0766152-1258-4bdb-b3ce-2d92c824657c",
    name: "Anitta",
    image: "https://e-cdn-images.dzcdn.net/images/artist/f06b3a644be9939c7875f1782fe4fb06/264x264-000000-80-0-0.jpg",
  },
  {
    id: "f0766152-1258-4bdb-b3ce-2d92c824657c",
    name: "Ludimilla",
    image: "https://e-cdn-images.dzcdn.net/images/artist/2ccd2da85b80cbea6537e8347813e58c/264x264-000000-80-0-0.jpg",
  },
];
const song = {
  id: "f0766152-1258-4bdb-b3ce-2d92c824657c",
  name: "Vai Malandra",
  status: "neutral", //liked, disliked, neutral
  isrc: "NIKIT2200838",
};

export const navbar: ComponentStory<typeof SongCard> = () => (
  <SongCard
    voting={() => {}}
    deejai={true}
    deezerLink="https://www.deejai.com/track/5e8f8f8f-f8f8-f8f8-f8f8-f8f8f8f8f8f8f"
    spotifyLink="https://open.spotify.com/track/5e8f8f8f-f8f8-f8f8-f8f8-f8f8f8f8f8f8f"
    deezerPreviewURL="https://cdns-preview-5.dzcdn.net/stream/c-5ac995d4ffd81eccda77f35db0fc2fb4-5.mp3"
    spotifyPreviewURL="https://cdns-preview-5.dzcdn.net/stream/c-5ac995d4ffd81eccda77f35db0fc2fb4-5.mp3"
    name={song.name}
    artists={artists}
    isrc={song.isrc}
    status={song.status}
    id={song.id}
  />
);
