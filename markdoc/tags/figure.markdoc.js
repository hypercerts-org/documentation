module.exports = {
  render: 'Figure',
  selfClosing: true,
  attributes: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String }
  }
};
