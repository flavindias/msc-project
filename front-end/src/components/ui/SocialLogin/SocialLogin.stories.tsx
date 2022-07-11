import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SocialLogin } from "./SocialLogin";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/SocialLogin",
  component: SocialLogin,
} as ComponentMeta<typeof SocialLogin>;


const screen = {
  name: "Where’s your songs?",
};
export const navbar: ComponentStory<typeof SocialLogin> = () => (
  <SocialLogin
    title={screen.name}
  />
);
