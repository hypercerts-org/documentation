import React from 'react';

const CARD_W = 180;
const CARD_H = 74;
const ACTIVITY = { x: 290, y: 150, w: 180, h: 88 };
const LEFT_X = 16;
const RIGHT_X = 564;

/** Records around the activity: each is published separately and links to the activity. */
const RECORDS = [
  { title: 'Energy project', type: 'collection (project)', by: 'the project', x: ACTIVITY.x, y: 20, relation: 'includes' },
  { title: 'Installation report', type: 'attachment', by: 'the project', x: LEFT_X, y: 70, relation: 'documents' },
  { title: 'Energy production', type: 'measurement', by: 'a monitoring partner', x: RIGHT_X, y: 70, relation: 'measures' },
  { title: 'Funding receipt', type: 'funding receipt', by: 'a funder', x: LEFT_X, y: 294, relation: 'funds' },
  { title: 'Specialist evaluation', type: 'evaluation', by: 'a specialist', x: RIGHT_X, y: 294, relation: 'assesses' },
];

/** Approximate pill width for a short relation label at 11px. */
const pillWidth = (label) => label.length * 6.4 + 16;

/**
 * Connect a record card to the activity card.
 * Returns the path and its midpoint, where the relation label sits.
 */
function connector(record) {
  const activityMidX = ACTIVITY.x + ACTIVITY.w / 2;

  if (record.x === ACTIVITY.x) {
    const startY = record.y + CARD_H;
    const endY = ACTIVITY.y - 2;
    return { d: `M${activityMidX} ${startY} V${endY}`, midX: activityMidX, midY: (startY + endY) / 2 };
  }

  const fromLeft = record.x < ACTIVITY.x;
  const cardMidY = record.y + CARD_H / 2;
  const startX = fromLeft ? record.x + CARD_W : record.x;
  const endX = fromLeft ? ACTIVITY.x - 2 : ACTIVITY.x + ACTIVITY.w + 2;
  const endY = cardMidY < ACTIVITY.y + ACTIVITY.h / 2 ? ACTIVITY.y + 24 : ACTIVITY.y + ACTIVITY.h - 24;
  const bendX = (startX + endX) / 2;
  return {
    d: `M${startX} ${cardMidY} C ${bendX} ${cardMidY}, ${bendX} ${endY}, ${endX} ${endY}`,
    midX: bendX,
    midY: (cardMidY + endY) / 2,
  };
}

/**
 * Show one activity claim with the separate records that describe, measure, assess, fund, and group it.
 * Used on the A Shared Language Guide page.
 */
export function SharedLanguageDiagram() {
  return (
    <figure className="guide-diagram">
      <div className="guide-diagram-scroll">
        <svg className="guide-diagram-svg" viewBox="0 0 760 390" role="img" aria-labelledby="shared-language-title shared-language-desc">
          <title id="shared-language-title">Records around one piece of work</title>
          <desc id="shared-language-desc">
            A solar installation activity claim, published by the project, sits at the center. A community energy project collection includes it. An installation report from the project documents it. An energy production measurement from a monitoring partner measures it. A specialist evaluation assesses it. A funding receipt from a funder records support for it. Each record is separate and links to the activity.
          </desc>
          <defs>
            <marker id="sld-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path className="gd-arrowhead-accent" d="M1 1 L9 5 L1 9 Z" />
            </marker>
          </defs>

          {RECORDS.map((record) => {
            const line = connector(record);
            return (
              <g key={record.title}>
                <path className="gd-flow gd-flow-accent" d={line.d} markerEnd="url(#sld-arrow)" />
                <rect className="gd-pill" x={line.midX - pillWidth(record.relation) / 2} y={line.midY - 10} width={pillWidth(record.relation)} height="20" rx="10" />
                <text className="gd-caption gd-caption-accent" x={line.midX} y={line.midY + 4} textAnchor="middle">{record.relation}</text>
              </g>
            );
          })}

          {RECORDS.map((record) => (
            <g key={`${record.title}-card`}>
              <rect className="gd-panel" x={record.x} y={record.y} width={CARD_W} height={CARD_H} rx="10" />
              <text className="gd-title" x={record.x + 14} y={record.y + 24}>{record.title}</text>
              <text className="gd-mono gd-mono-accent" x={record.x + 14} y={record.y + 44}>{record.type}</text>
              <text className="gd-caption" x={record.x + 14} y={record.y + 62}>by {record.by}</text>
            </g>
          ))}

          <rect className="gd-panel gd-panel-accent" x={ACTIVITY.x} y={ACTIVITY.y} width={ACTIVITY.w} height={ACTIVITY.h} rx="12" />
          <text className="gd-eyebrow" x={ACTIVITY.x + 16} y={ACTIVITY.y + 24}>Activity claim</text>
          <text className="gd-title gd-title-large" x={ACTIVITY.x + 16} y={ACTIVITY.y + 50}>Solar installation</text>
          <text className="gd-caption" x={ACTIVITY.x + 16} y={ACTIVITY.y + 72}>by the project</text>
        </svg>
      </div>
      <figcaption className="figure-caption">
        Each box is a separate record, published by its own account. Links point from each record to the work it concerns.
      </figcaption>
    </figure>
  );
}
