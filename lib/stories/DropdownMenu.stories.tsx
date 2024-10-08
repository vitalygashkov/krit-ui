import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

const meta = {
  title: 'DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
