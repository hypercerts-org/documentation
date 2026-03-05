module.exports = {
  render: 'Callout',
  children: ['paragraph', 'tag', 'list'],
  attributes: {
    type: {
      type: String,
      default: 'info',
      matches: ['info', 'warning', 'danger', 'success'],
      errorLevel: 'critical'
    },
    title: {
      type: String
    }
  }
};
