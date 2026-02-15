import '../styles/globals.css';
import Layout from '../components/Layout';
import { Callout } from '../components/Callout';
import { Columns } from '../components/Columns';
import { Column } from '../components/Column';
import { Figure } from '../components/Figure';
import { Heading } from '../components/Heading';
import { CardLink } from '../components/CardLink';
import { CodeBlock } from '../components/CodeBlock';

const components = {
  Callout,
  Columns,
  Column,
  Figure,
  Heading,
  CardLink,
  CodeBlock,
};

export default function App({ Component, pageProps }) {
  return (
    <Layout frontmatter={pageProps.markdoc?.frontmatter}>
      <Component {...pageProps} components={components} />
    </Layout>
  );
}
