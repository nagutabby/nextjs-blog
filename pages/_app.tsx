import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout';
import SEO from '../next-seo.config';
import { DefaultSeo } from 'next-seo';
import "prismjs/themes/prism-tomorrow.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}

