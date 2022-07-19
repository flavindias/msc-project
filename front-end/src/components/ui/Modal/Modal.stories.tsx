import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Modal } from "./Modal";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "UI/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

export const myModal: ComponentStory<typeof Modal> = () => (
  <Modal toggleModal={()=>{}} createRoomFn={() => {}} hide={false}/>
);
