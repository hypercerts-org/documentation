import React from 'react';
import Link from 'next/link';

/** Records added after the project profile, in the order the chart shows them. The activity claim comes first, since the others attach to the work it describes. */
const SIGNALS = [
  { name: 'Activity claim', by: 'The project', group: 'Project', record: 'activity claim', href: '/core-concepts/what-is-hypercerts' },
  { name: 'Progress update', by: 'The project', group: 'Project', record: 'attachment', href: '/core-concepts/evidence-and-measurements' },
  { name: 'Peer endorsement', by: 'A peer network', group: 'Attestation', record: 'badge award', href: '/core-concepts/certified-identity' },
  { name: 'Community evaluation', by: 'Local participants', group: 'Attestation', record: 'evaluation', href: '/core-concepts/evaluations' },
  { name: 'Impact data', by: 'A monitoring partner', group: 'Attestation', record: 'measurement', href: '/core-concepts/evidence-and-measurements' },
  { name: 'Expert assessment', by: 'A specialist', group: 'Attestation', record: 'evaluation', href: '/core-concepts/evaluations' },
  { name: 'Funding record', by: 'A funder or a third party', group: 'Funder', record: 'funding receipt', href: '/core-concepts/funding-and-value-flow' },
];

/** Chart geometry in viewBox units: the step line rises one level at each signal. */
const START_X = 56;
const END_X = 712;
const BASE_Y = 205;
const STEP_Y = 21;
const RISERS = [150, 226, 302, 378, 454, 530, 606];
const ATTESTATIONS = [2, 5];

const levelY = (index) => BASE_Y - STEP_Y * (index + 1);
const stepPath = [
  `M${START_X} ${BASE_Y}`,
  ...RISERS.map((x, index) => `H${x} V${levelY(index)}`),
  `H${END_X}`,
].join(' ');

/**
 * Show how independent signals accumulate on a project's record over time.
 * The chart is adapted from the hypercerts.org trust timeline, with the activity claim added as the first step; the cards name who publishes each record and its type.
 */
export function TrustTimeline() {
  const bracketStart = RISERS[ATTESTATIONS[0]];
  const bracketEnd = RISERS[ATTESTATIONS[1]];

  return (
    <figure className="trust-timeline">
      <svg className="trust-timeline-chart" viewBox="0 0 760 255" role="img" aria-labelledby="trust-timeline-title trust-timeline-desc">
        <title id="trust-timeline-title">Trust builds over time</title>
        <desc id="trust-timeline-desc">
          A step line rises from a project profile through seven records: an activity claim, a progress update attached to it, four third-party attestations, and a funding record. The next funding decision starts from this history.
        </desc>

        <path className="tt-axis" d="M40 20 V225 H744" />
        <path className="tt-axis" d="M36 26 L40 20 L44 26 M738 221 L744 225 L738 229" />
        <text className="tt-label" x="48" y="24">Trust</text>
        <text className="tt-label" x="744" y="246" textAnchor="end">Time</text>

        <path className="tt-leader" d={`M${bracketStart} 46 H${bracketEnd}`} />
        {RISERS.slice(ATTESTATIONS[0], ATTESTATIONS[1] + 1).map((x, offset) => (
          <path key={x} className="tt-leader" d={`M${x} 46 V${levelY(ATTESTATIONS[0] + offset) - 14}`} />
        ))}
        <text className="tt-label" x={(bracketStart + bracketEnd) / 2} y="38" textAnchor="middle">Third-party attestations</text>

        <path className="tt-step" d={stepPath} />
        <path className="tt-step" d={`M${END_X - 6} ${levelY(RISERS.length - 1) - 5} L${END_X} ${levelY(RISERS.length - 1)} L${END_X - 6} ${levelY(RISERS.length - 1) + 5}`} />

        <circle className="tt-start" cx={START_X} cy={BASE_Y} r="5" />
        <text className="tt-label tt-label-strong" x={START_X - 6} y={BASE_Y - 12}>Project profile</text>

        {RISERS.map((x, index) => (
          <g key={x}>
            <circle className="tt-badge" cx={x} cy={levelY(index)} r="10" />
            <text className="tt-badge-number" x={x} y={levelY(index) + 4} textAnchor="middle">{index + 1}</text>
          </g>
        ))}

        <text className="tt-label tt-label-strong" x="744" y="20" textAnchor="end">Next funding decision</text>
        <text className="tt-label" x="744" y="35" textAnchor="end">starts from this history</text>
      </svg>

      <ol className="trust-timeline-signals">
        {SIGNALS.map((signal, index) => (
          <li key={signal.name} className={`tt-card${signal.group === 'Attestation' ? ' tt-card-attestation' : ''}`}>
            <div className="tt-card-header">
              <span className="tt-card-number" aria-hidden="true">{index + 1}</span>
              <span className="tt-card-group">{signal.group}</span>
            </div>
            <div className="tt-card-name">{signal.name}</div>
            <div className="tt-card-by">Published by {signal.by.charAt(0).toLowerCase() + signal.by.slice(1)}</div>
            <Link className="tt-card-record" href={signal.href}>{signal.record}</Link>
          </li>
        ))}
      </ol>

      <figcaption className="figure-caption">
        Each signal is a separate record, published by whoever provides it and linked to the project's work.
      </figcaption>
    </figure>
  );
}
