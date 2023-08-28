import type { Meta, StoryObj } from '@storybook/react';

import Copy from '@_components/Copy';

const meta = {
  title: 'Other/Copy',
  component: Copy,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Copy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: 'copy me',
  },
};
