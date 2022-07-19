import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { NavBar } from "./NavBar";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/NavBar",
  component: NavBar,
} as ComponentMeta<typeof NavBar>;

const user = {
  name: "John Doe",
  player: "Player Name",
  photo: "https://randomuser.me/api/portraits/men/7.jpg",
};
export const navbar: ComponentStory<typeof NavBar> = () => (
  <NavBar
  goToLogin={()=>{}}
    goHome={() => {}}
    goToRoom={() => {}}
    goToSongs={() => {}}
    logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"}
    user={user}
  />
);
