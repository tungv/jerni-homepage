import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";
import { MDXProvider } from "@mdx-js/react";

const components = {
  p: styled.p`
    font-family: "Noto Serif", serif;
    text-align: justify;

    ::first-letter {
      padding-left: 1em;
    }
  `,
  li: styled.li`
    font-family: "Noto Serif", serif;
  `,
  inlineCode: styled.code`
    font-family: "Oxygen Mono", monospace;
    display: inline-block;
    box-sizing: border-box;
    background: #efefef;
    border: 1px solid rgba(0, 0, 0, 0.125);
    padding: 1px 0.5rem;
    border-radius: 8px;
  `,
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
            padding: 24px;
          }
        `}</style>
      </div>
    </MDXProvider>
  );
}
