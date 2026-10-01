import React from 'react';

/** One box in the diagram: title, a short role line, and optional accent styling. */
function Node({ x, y, w, h = 56, title, role, accent = false }) {
  return (
    <g>
      <rect className={`gd-panel${accent ? ' gd-panel-accent' : ''}`} x={x} y={y} width={w} height={h} rx="10" />
      <text className="gd-title" x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle">{title}</text>
      <text className="gd-caption" x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle">{role}</text>
    </g>
  );
}

/** A connector with an arrowhead and an optional label pill at its midpoint. */
function Edge({ d, label, labelX, labelY, write = false }) {
  const width = label ? label.length * 6.2 + 16 : 0;
  return (
    <g>
      <path className={write ? 'gd-flow gd-flow-accent' : 'gd-flow'} d={d} markerEnd={`url(#stack-arrow${write ? '-accent' : ''})`} />
      {label && (
        <>
          <rect className="gd-pill" x={labelX - width / 2} y={labelY - 10} width={width} height="20" rx="10" />
          <text className={`gd-caption${write ? ' gd-caption-accent' : ''}`} x={labelX} y={labelY + 4} textAnchor="middle">{label}</text>
        </>
      )}
    </g>
  );
}

/**
 * Show the Hypercerts stack: records in many PDSs flow through the relay and Jetstream to the indexer,
 * which serves the Hypercerts API to applications; the entryway and CGS handle sign-in and group writes.
 * Used on the Services and tooling overview.
 */
export function StackDiagram() {
  return (
    <figure className="guide-diagram">
      <div className="guide-diagram-scroll">
        <svg className="guide-diagram-svg" viewBox="0 0 760 500" role="img" aria-labelledby="stack-title stack-desc">
          <title id="stack-title">The Hypercerts stack</title>
          <desc id="stack-desc">
            Records live in many PDSs, some hosted by Certified and some independent. The Hypercerts Relay collects changes from them, Jetstream filters those changes to Hypercerts and Certified records, and the indexer builds a searchable view that serves the Hypercerts API. Labelers publish labels that the indexer uses. Applications read through the SDK or the API. To write, users sign in through the entryway, which hosts Certified accounts on the Certified PDSs, and groups write through the Certified Group Service. The feed service provides feeds to applications on its own.
          </desc>
          <defs>
            <marker id="stack-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path className="gd-arrowhead" d="M1 1 L9 5 L1 9 Z" />
            </marker>
            <marker id="stack-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path className="gd-arrowhead-accent" d="M1 1 L9 5 L1 9 Z" />
            </marker>
          </defs>

          {/* Applications */}
          <rect className="gd-panel gd-panel-accent" x="176" y="24" width="408" height="64" rx="12" />
          <text className="gd-title gd-title-large" x="196" y="52">Your application</text>
          <text className="gd-caption" x="196" y="72">Reads through the SDK or the API; writes as the signed-in user</text>
          <Node x={604} y={28} w={140} title="Feed Service" role="ready-made feeds" />
          <Edge d="M602 56 H588" />

          {/* Account side: writing */}
          <Node x={16} y={150} w={150} title="Entryway" role="sign-in and accounts" />
          <Node x={186} y={150} w={150} title="Certified Group Service" role="group accounts" />
          <Edge d="M232 90 C 232 120, 91 118, 91 148" label="sign in" labelX={150} labelY={116} write />
          <Edge d="M300 90 V148" label="group writes" labelX={300} labelY={118} write />

          {/* Read side */}
          <Node x={404} y={150} w={186} title="Indexer" role="serves the Hypercerts API" accent />
          <Node x={610} y={150} w={134} title="Labelers" role="publish labels" />
          <Edge d="M608 178 H594" />
          <text className="gd-caption" x="600" y="232" textAnchor="middle">labels</text>
          <Edge d="M497 148 V92" label="SDK / API" labelX={497} labelY={118} />

          <Node x={404} y={256} w={130} h={52} title="Hypercerts Relay" role="collects changes" />
          <Node x={574} y={256} w={130} h={52} title="Jetstream" role="filters and replays" />
          <Edge d="M536 282 H570" />
          <Edge d="M639 254 C 639 232, 540 232, 540 210" />

          {/* Where records live */}
          <text className="gd-eyebrow" x="16" y="456">Where records live: PDSs</text>
          <Node x={16} y={380} w={190} title="Certified PDSs" role="hosted by the Foundation" accent />
          <Node x={226} y={380} w={190} title="Independent PDS" role="any AT Protocol host" />
          <Node x={436} y={380} w={190} title="Independent PDS" role="any AT Protocol host" />
          <Edge d="M91 212 V376" label="hosts accounts" labelX={91} labelY={296} write />
          <Edge d="M261 212 C 261 300, 300 320, 300 376" label="writes" labelX={282} labelY={296} write />

          <path className="gd-flow" d="M111 380 V344 H531 V380 M321 380 V344" />
          <Edge d="M469 344 V312" />
          <text className="gd-caption" x="560" y="338" textAnchor="middle">record changes</text>

          {/* Legend */}
          <path className="gd-flow" d="M470 476 H498" />
          <text className="gd-caption" x="506" y="480">reading</text>
          <path className="gd-flow gd-flow-accent" d="M566 476 H594" />
          <text className="gd-caption" x="602" y="480">signing in and writing</text>
        </svg>
      </div>
      <figcaption className="figure-caption">
        Records stay in each account's PDS. The relay, Jetstream, and indexer bring them together for reading, while the entryway and CGS handle signing in and writing.
      </figcaption>
    </figure>
  );
}
