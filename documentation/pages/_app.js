import '../styles/globals.css';
import { Callout } from '../components/Callout';
import { Columns } from '../components/Columns';
import { Column } from '../components/Column';
import { Figure } from '../components/Figure';

const components = {
  Callout,
  Columns,
  Column,
  Figure,
};

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} components={components} />;
}
