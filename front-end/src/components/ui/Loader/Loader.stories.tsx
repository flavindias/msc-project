import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Loader } from './Loader';

export default {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: 'UI/Loader',
	component: Loader,
} as ComponentMeta<typeof Loader>;

export const navbar: ComponentStory<typeof Loader> = () => (
	<Loader isLoading={true}/>
);
