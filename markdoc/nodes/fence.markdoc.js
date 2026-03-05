const fence = {
  render: "CodeBlock",
  attributes: {
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    process: {
      type: Boolean,
      render: false,
      default: true,
    },
  },
};

export default fence;
