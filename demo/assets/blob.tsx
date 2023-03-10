const args = {
  type: "button",
  value: "update me",
} as const;

type Key = keyof typeof args;

export default {
  render() {
    return <input {...args} />;
  },
};
