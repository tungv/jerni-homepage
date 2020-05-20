import Head from "next/head";
import slugify from "slugify";
import styled from "@emotion/styled";

import { MDXProvider } from "@mdx-js/react";
import Navigation from "./Navigation";

const components = {
  p: styled.p`
    font-family: "Noto Serif", serif;
    text-align: justify;
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
    color: black;
    padding: 1px 0.5rem;
    border-radius: 8px;
  `,
  h1: styled.h1`
    font-size: 3rem;
    margin: 2rem 0;
  `,
  h2: SlugifiedHeader,
  dash() {
    return "—";
  },
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
        <Navigation />
        <main>{children}</main>
        <style jsx global>
          {`
            body {
              font-size: 16px;
              font-family: "Lato", sans-serif;
              margin: 0;
              padding: 0;
            }

            *::selection {
              background: #fcd6d9;
              color: black;
            }
          `}
        </style>
        <style jsx>{`
          main {
            padding: 24px;
            max-width: 960px;
            margin: auto;
          }
        `}</style>
      </div>
    </MDXProvider>
  );
}

function SlugifiedHeader({ children, ...props }) {
  const id = slugify(children).toLowerCase();

  return (
    <h2 {...props} id={id} name={id}>
      <a title={`Jump to section: ${children}`} href={`#${id}`}>
        #
      </a>
      <span>{children}</span>
      <style jsx>{`
        h2 {
          position: relative;
        }
        a {
          font-family: "Lato", sans-serif;
          display: block;
          position: absolute;
          left: -1.2rem;
        }
      `}</style>
    </h2>
  );
}
