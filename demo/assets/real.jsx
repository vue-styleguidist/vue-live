const args = {
  type: "button",
  value: "update me"
};

export default {
  render() {
    return <input {...args} />;
  }
};
