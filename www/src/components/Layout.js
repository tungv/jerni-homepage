import Head from "next/head";
import Link from "next/link";
import { MDXProvider } from "@mdx-js/react";

const components = {
  p: TextBlock,
};

export default function Layout({ children, title }) {
  return (
    <MDXProvider components={components}>
      <div>
        <Head>
          <title>{title}</title>
          <meta property="og:title" content={title} key="title" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Oxygen+Mono&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <nav>
          <ol>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
          </ol>
        </nav>
        <main>{children}</main>
        <style jsx>{`
          main {
            font-family: "Lato", sans-serif;
          }
        `}</style>
      </div>
    </MDXProvider>
  );
}

function TextBlock({ children, ...others }) {
  return (
    <p {...others}>
      {children}
      <style jsx>{`
        p {
          font-family: "Noto Serif", serif;
        }
      `}</style>
    </p>
  );
}
