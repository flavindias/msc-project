import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PageHeader } from './PageHeader';

export default {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: 'UI/PageHeader',
	component: PageHeader,
} as ComponentMeta<typeof PageHeader>;

export const navbar: ComponentStory<typeof PageHeader> = () => (
	<PageHeader title='Songs'/>
);
