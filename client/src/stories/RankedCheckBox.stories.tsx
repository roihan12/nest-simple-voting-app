import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import RankedCheckBox from "../components/ui/RankedCheckBox";

export default {
  title: "RankedCheckBox",
  component: RankedCheckBox,
  argTypes: {
    onSelect: { action: "selected" },
  },
} as Meta<typeof RankedCheckBox>;

const Template: StoryFn<typeof RankedCheckBox> = (args) => (
  <div className="h-screen max-w-sm m-auto">
    <RankedCheckBox {...args} />
  </div>
);

export const Ranked = Template.bind({});
Ranked.args = {
  rank: 1,
  value: "Tim's tacos",
};

export const Unranked = Template.bind({});
Unranked.args = {
  value: "Tim's tacos",
};
