function slugifyHeadingText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "section";
}

/**
 * Return stable, page-unique IDs for headings collected by the table of contents.
 * Existing unique IDs stay unchanged so inbound anchors keep working; only repeated
 * IDs receive numeric suffixes, while IDs already used by later headings are reserved.
 */
export function createUniqueHeadingIds(headings) {
  const baseIds = headings.map(({ id, text }) => id || slugifyHeadingText(text));
  const reservedIds = new Set(baseIds);
  const usedIds = new Set();

  return baseIds.map((baseId) => {
    if (!usedIds.has(baseId)) {
      usedIds.add(baseId);
      return baseId;
    }

    let suffix = 2;
    let candidate = `${baseId}-${suffix}`;
    while (usedIds.has(candidate) || reservedIds.has(candidate)) {
      suffix += 1;
      candidate = `${baseId}-${suffix}`;
    }

    usedIds.add(candidate);
    return candidate;
  });
}
