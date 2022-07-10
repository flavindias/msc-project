import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { RoomCard } from "./RoomCard";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/RoomCard",
  component: RoomCard,
} as ComponentMeta<typeof RoomCard>;
const owner = {
    id: "1",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/women/64.jpg",
};

const members = [
  {
    id: "f0766152-1258-4bdb-b3ce-2d92c824657c",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
];
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
const room = {
  title: "Room Name",
  id: "f0766152-1258-4bdb-b3ce-2d92c824657c",
  updatedAt: "2022-07-10T10:43:46.840Z",
};
export const navbar: ComponentStory<typeof RoomCard> = () => (
  <RoomCard
    artists={artists}
    members={members}
    owner={owner}
    title={room.title}
    id={room.id}
    updatedAt={room.updatedAt}
  />
);
