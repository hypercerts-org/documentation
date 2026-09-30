export default {
  render: 'DocsSection',
  attributes: {
    title: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, required: true, matches: ['guide', 'integration', 'reference', 'changes'] },
    description: { type: String, required: true },
    layout: { type: String, default: 'cards', matches: ['cards', 'row', 'list', 'table'] },
  },
};
