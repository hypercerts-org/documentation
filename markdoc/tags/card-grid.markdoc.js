export default {
  render: "CardGrid",
  children: ["paragraph", "tag", "list"],
  attributes: {
    columns: { type: Number, default: 2 },
  },
};
