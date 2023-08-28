import type { Meta, StoryObj } from '@storybook/react';

import Search from '@_components/Search';
const searchValidator = [
  {
    label: 'All Filters',
    key: 0,
    limitNumber: 1,
  },
  {
    label: 'token',
    key: 1,
    limitNumber: 1,
  },
  {
    label: 'account',
    key: 2,
    limitNumber: 9,
  },
  {
    label: 'contract',
    key: 3,
    limitNumber: 2,
  },
];
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Other/Search',
  component: Search,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

const onSearchButtonClickHandler = (val) => {
  console.log(val);
};

export const Primary: Story = {
  args: {
    searchIcon: false,
    searchButton: true,
    searchValidator: searchValidator,
    placeholder: 'Search by Address / Txn Hash / Block',
    isMobile: false,
    onSearchButtonClickHandler: onSearchButtonClickHandler,
  },
};
