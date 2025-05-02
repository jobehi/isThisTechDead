import type { Meta, StoryObj } from '@storybook/react';
import { Heading3, MutedText } from './Typography';

const meta: Meta<typeof Heading3 | typeof MutedText> = {
  title: 'Atoms/Typography',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const DefaultHeading3: StoryObj<typeof Heading3> = {
  render: () => <Heading3>Heading 3 Example</Heading3>,
};

export const BoldHeading3: StoryObj<typeof Heading3> = {
  render: () => <Heading3 weight="bold">Bold Heading 3</Heading3>,
};

export const CenteredHeading3: StoryObj<typeof Heading3> = {
  render: () => <Heading3 align="center">Centered Heading 3</Heading3>,
};

export const UppercaseHeading3: StoryObj<typeof Heading3> = {
  render: () => <Heading3 transform="uppercase">Uppercase Heading 3</Heading3>,
};

export const CustomHeading3: StoryObj<typeof Heading3> = {
  render: () => (
    <Heading3 weight="bold" align="center" transform="uppercase" className="text-lime-500">
      Custom Heading 3
    </Heading3>
  ),
};

export const DefaultMutedText: StoryObj<typeof MutedText> = {
  render: () => <MutedText>This is muted text for less important information</MutedText>,
};

export const BoldMutedText: StoryObj<typeof MutedText> = {
  render: () => <MutedText weight="bold">Bold muted text</MutedText>,
};

export const CenteredMutedText: StoryObj<typeof MutedText> = {
  render: () => <MutedText align="center">Centered muted text</MutedText>,
};

export const CustomMutedText: StoryObj<typeof MutedText> = {
  render: () => (
    <MutedText weight="medium" transform="capitalize" className="text-zinc-500">
      Custom muted text styling
    </MutedText>
  ),
};
