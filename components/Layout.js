import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta property='og:title' content={title} key='title' />
      </Head>

      <header>
        <Link href='/'>
          <a>Podcasts</a>
        </Link>
      </header>

      {children}

      <style jsx>
        {`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          header a {
            color: #fff;
            text-decoration: none;
          }
        `}
      </style>

      <style jsx global>
        {`
          body {
            margin: 0;
            background: white;
            font-family: system-ui;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
