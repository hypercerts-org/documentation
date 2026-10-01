import '@hypercerts-org/ui-react/styles.css';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { Callout } from '../components/Callout';
import { Columns } from '../components/Columns';
import { Column } from '../components/Column';
import { Figure } from '../components/Figure';
import { Heading } from '../components/Heading';
import { CardLink } from '../components/CardLink';
import { CodeBlock } from '../components/CodeBlock';
import { Link } from '../components/Link';
import { DotPattern } from '../components/DotPattern';
import { HeroBanner } from '../components/HeroBanner';
import { CardGrid } from '../components/CardGrid';
import { DocsSection } from '../components/DocsSection';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { TrustTimeline } from '../components/TrustTimeline';
import { AccountRecordsDiagram } from '../components/AccountRecordsDiagram';
import { SharedLanguageDiagram } from '../components/SharedLanguageDiagram';
import { StackDiagram } from '../components/StackDiagram';
import { Analytics } from '@vercel/analytics/next';
import NextLink from 'next/link';
import { UIProvider } from '@hypercerts-org/ui-react';
import { DocsHero } from '../components/DocsHero';

const components = {
  Callout,
  Columns,
  Column,
  Figure,
  Heading,
  CardLink,
  CodeBlock,
  Fence: CodeBlock,
  Link,
  DotPattern,
  HeroBanner,
  CardGrid,
  DocsSection,
  MermaidDiagram,
  TrustTimeline,
  AccountRecordsDiagram,
  SharedLanguageDiagram,
  StackDiagram,
  DocsHero,
};

export default function App({ Component, pageProps }) {
  return (
    <UIProvider link={NextLink}>
      <Layout frontmatter={pageProps.markdoc?.frontmatter}>
        <Component {...pageProps} components={components} />
        <Analytics />
      </Layout>
    </UIProvider>
  );
}
