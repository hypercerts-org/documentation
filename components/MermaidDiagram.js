import { useEffect, useMemo, useState } from 'react';
import { CodeBlock } from './CodeBlock';

/** Cached Mermaid module load shared by every diagram on the current page. */
let mermaidModulePromise;
/** Monotonic counter used to give Mermaid render targets unique DOM identifiers. */
let diagramIdCounter = 0;

/**
 * Load Mermaid once per browser session while allowing a failed chunk load to be retried.
 */
function getMermaid() {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid')
      .then((module) => module.default || module)
      .catch((error) => {
        mermaidModulePromise = undefined;
        throw error;
      });
  }

  return mermaidModulePromise;
}

/**
 * Allocate a unique identifier for one Mermaid render target.
 */
function getDiagramId() {
  diagramIdCounter += 1;
  return `mermaid-diagram-${diagramIdCounter}`;
}

/**
 * Select the Mermaid theme that matches the current documentation color scheme.
 */
function getPreferredMermaidTheme() {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  return 'neutral';
}

/**
 * Render a Mermaid fenced code block as an SVG diagram in the browser.
 * Use this for Markdown fences with `mermaid` as the language; invalid diagrams fall back to copyable code with an actionable syntax error.
 */
export function MermaidDiagram({ chart, children }) {
  const source = (chart || children || '').trim();
  const diagramId = useMemo(getDiagramId, []);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(source));
  const [theme, setTheme] = useState('neutral');

  useEffect(() => {
    /** Synchronize the diagram theme when the page color-scheme class changes. */
    const updateTheme = () => setTheme(getPreferredMermaidTheme());
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!source) {
      setLoading(false);
      setError(new Error('No Mermaid source was provided. Add diagram text inside the mermaid code fence.'));
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSvg('');

    /**
     * Render the current source with Mermaid unless this React effect has been cancelled.
     */
    async function renderDiagram() {
      try {
        const mermaid = await getMermaid();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme,
        });
        const result = await mermaid.render(diagramId, source);
        if (cancelled) return;
        setSvg(result.svg);
      } catch (err) {
        if (cancelled) return;
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagramId, source, theme]);

  if (error) {
    return (
      <div className="mermaid-diagram mermaid-diagram--error">
        <p>
          <strong>Could not render Mermaid diagram.</strong> Check the diagram syntax in the source Markdown and reload the page. Details: {error.message}
        </p>
        <CodeBlock content={source} language="mermaid" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mermaid-diagram mermaid-diagram--loading" role="status">
        Rendering Mermaid diagram…
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
