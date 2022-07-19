import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ModalJoin } from "./ModalJoin";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/ModalJoin",
  component: ModalJoin,
} as ComponentMeta<typeof ModalJoin>;

export const myModal: ComponentStory<typeof ModalJoin> = () => (
  <ModalJoin id="123" toggleModal={()=>{}} hide={false}/>
);
