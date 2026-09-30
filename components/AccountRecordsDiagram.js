import React from 'react';

/** Accounts shown in the left column, each with the records its repository holds. */
const ACCOUNTS = [
  {
    name: 'Project',
    did: 'did:plc:project',
    y: 44,
    records: [
      { label: 'Profile', type: 'profile' },
      { label: 'Activity claim', type: 'activity' },
      { label: 'Progress update', type: 'attachment' },
    ],
  },
  { name: 'Evaluator', did: 'did:plc:evaluator', y: 202, records: [{ label: 'Evaluation', type: 'evaluation' }] },
  { name: 'Funder', did: 'did:plc:funder', y: 292, records: [{ label: 'Funding receipt', type: 'funding receipt' }] },
];

const APPS = [
  { name: 'Funding platform', y: 44 },
  { name: 'Evaluation tool', y: 150 },
  { name: 'Directory', y: 256 },
];

const REPO_X = 24;
const REPO_W = 252;
const CHIP_X = REPO_X + 14;
const CHIP_W = REPO_W - 28;
const CHIP_H = 24;
const HEADER_H = 34;
const APP_X = 540;
const APP_W = 196;
const APP_H = 86;

const repoHeight = (account) => HEADER_H + account.records.length * (CHIP_H + 6) + 8;
const chipY = (account, index) => account.y + HEADER_H + index * (CHIP_H + 6);
const repoMidY = (account) => account.y + repoHeight(account) / 2;

/** The activity chip that the evaluation and funding receipt link to. */
const ACTIVITY_Y = chipY(ACCOUNTS[0], 1) + CHIP_H / 2;

/**
 * Show that each account keeps its own records, links connect them, and apps read across accounts through the network.
 * Used on the Why AT Protocol? Guide page.
 */
export function AccountRecordsDiagram() {
  const evaluationY = chipY(ACCOUNTS[1], 0) + CHIP_H / 2;
  const receiptY = chipY(ACCOUNTS[2], 0) + CHIP_H / 2;

  return (
    <figure className="guide-diagram">
      <div className="guide-diagram-scroll">
        <svg className="guide-diagram-svg" viewBox="0 0 760 426" role="img" aria-labelledby="account-records-title account-records-desc">
          <title id="account-records-title">Records live with their authors</title>
          <desc id="account-records-desc">
            A project, an evaluator, and a funder each keep records in their own repository under their own DID. The evaluation and the funding receipt link to the project's activity claim. A relay and an indexer collect records from all three repositories, and a funding platform, an evaluation tool, and a directory each read across them. The project can move its repository to another host and keep its DID, records, and incoming links.
          </desc>
          <defs>
            <marker id="ard-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path className="gd-arrowhead" d="M1 1 L9 5 L1 9 Z" />
            </marker>
            <marker id="ard-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path className="gd-arrowhead-accent" d="M1 1 L9 5 L1 9 Z" />
            </marker>
          </defs>

          <text className="gd-eyebrow" x={REPO_X} y="24">Accounts own their records</text>
          <text className="gd-eyebrow" x="408" y="24" textAnchor="middle">The network collects them</text>
          <text className="gd-eyebrow" x={APP_X + APP_W} y="24" textAnchor="end">Apps read across accounts</text>

          {ACCOUNTS.map((account) => (
            <g key={account.name}>
              <rect className="gd-panel" x={REPO_X} y={account.y} width={REPO_W} height={repoHeight(account)} rx="10" />
              <text className="gd-title" x={REPO_X + 14} y={account.y + 22}>{account.name}</text>
              <text className="gd-mono" x={REPO_X + REPO_W - 14} y={account.y + 22} textAnchor="end">{account.did}</text>
              {account.records.map((record, index) => (
                <g key={record.label}>
                  <rect
                    className={record.type === 'activity' ? 'gd-chip gd-chip-accent' : 'gd-chip'}
                    x={CHIP_X}
                    y={chipY(account, index)}
                    width={CHIP_W}
                    height={CHIP_H}
                    rx="6"
                  />
                  <text className="gd-text" x={CHIP_X + 10} y={chipY(account, index) + 16}>{record.label}</text>
                  <text className="gd-mono" x={CHIP_X + CHIP_W - 10} y={chipY(account, index) + 16} textAnchor="end">{record.type}</text>
                </g>
              ))}
            </g>
          ))}

          <path className="gd-link" d={`M${CHIP_X} ${evaluationY} C ${REPO_X - 8} ${evaluationY}, ${REPO_X - 8} ${ACTIVITY_Y + 4}, ${CHIP_X - 1} ${ACTIVITY_Y + 4}`} markerEnd="url(#ard-arrow-accent)" />
          <path className="gd-link" d={`M${CHIP_X} ${receiptY} C ${REPO_X - 14} ${receiptY}, ${REPO_X - 14} ${ACTIVITY_Y - 4}, ${CHIP_X - 1} ${ACTIVITY_Y - 4}`} markerEnd="url(#ard-arrow-accent)" />
          <text className="gd-caption gd-caption-accent" x="8" y={(ACTIVITY_Y + evaluationY) / 2 + 14} transform={`rotate(-90 8 ${(ACTIVITY_Y + evaluationY) / 2 + 14})`} textAnchor="middle">links</text>

          <rect className="gd-node" x="348" y="140" width="120" height="38" rx="19" />
          <text className="gd-title" x="408" y="164" textAnchor="middle">Relay</text>
          <rect className="gd-node" x="348" y="214" width="120" height="38" rx="19" />
          <text className="gd-title" x="408" y="238" textAnchor="middle">Indexer</text>
          <path className="gd-flow" d="M408 178 V212" markerEnd="url(#ard-arrow)" />

          {ACCOUNTS.map((account, index) => {
            const startY = repoMidY(account);
            const endY = 151 + index * 8;
            return (
              <path
                key={account.name}
                className="gd-flow"
                d={`M${REPO_X + REPO_W} ${startY} C ${REPO_X + REPO_W + 40} ${startY}, 306 ${endY}, 346 ${endY}`}
                markerEnd="url(#ard-arrow)"
              />
            );
          })}

          {APPS.map((app, index) => {
            const startY = 226 + index * 8;
            const endY = app.y + APP_H / 2 + 6;
            return (
              <g key={app.name}>
                <path className="gd-flow" d={`M468 ${startY} C 500 ${startY}, 504 ${endY}, ${APP_X - 2} ${endY}`} markerEnd="url(#ard-arrow)" />
                <rect className="gd-panel" x={APP_X} y={app.y} width={APP_W} height={APP_H} rx="10" />
                <path className="gd-divider" d={`M${APP_X} ${app.y + 20} H${APP_X + APP_W}`} />
                {[0, 1, 2].map((dot) => (
                  <circle key={dot} className="gd-dot" cx={APP_X + 12 + dot * 10} cy={app.y + 10} r="3" />
                ))}
                <text className="gd-title" x={APP_X + 14} y={app.y + 44}>{app.name}</text>
                <rect className="gd-skeleton" x={APP_X + 14} y={app.y + 56} width="120" height="6" rx="3" />
                <rect className="gd-skeleton" x={APP_X + 14} y={app.y + 68} width="84" height="6" rx="3" />
              </g>
            );
          })}

          <path className="gd-divider" d="M24 372 H736" />
          <text className="gd-eyebrow" x={REPO_X} y="398">Portability</text>
          <rect className="gd-node" x="120" y="382" width="92" height="30" rx="8" />
          <text className="gd-text" x="166" y="402" textAnchor="middle">Host A</text>
          <path className="gd-flow gd-flow-accent" d="M216 397 H282" markerEnd="url(#ard-arrow-accent)" />
          <text className="gd-caption gd-caption-accent" x="249" y="390" textAnchor="middle">moves</text>
          <rect className="gd-node" x="286" y="382" width="92" height="30" rx="8" />
          <text className="gd-text" x="332" y="402" textAnchor="middle">Host B</text>
          <text className="gd-text" x="396" y="395">The project changes hosts. Its DID, its records,</text>
          <text className="gd-text" x="396" y="412">and the links others made to them stay the same.</text>
        </svg>
      </div>
      <figcaption className="figure-caption">
        Each account keeps its own records. Links connect them, and any app can read across all of them.
      </figcaption>
    </figure>
  );
}
