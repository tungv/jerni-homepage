import Link from "next/link";
import Head from "next/head";
import React from "react";

export default function HomeLayout({
  children,
  title = "jerni - a framework to build data-driven products from the ground up",
}) {
  return (
    <main className="m-2 lg:m-12">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>home</a>
            </Link>
          </li>
          <li>
            <a href="https://github.com/tungv/jerni" target="_blank">
              GitHub
            </a>
          </li>
          <li>
            <Link href="/references">
              <a>API References</a>
            </Link>
          </li>
          <li>
            <Link href="/tutorials">
              <a>Tutorials</a>
            </Link>
          </li>
          <li>
            <Link href="/blog">
              <a>Blogs</a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="grid grid-cols-1 gap-6">
        <h1 className="mb-4 max-w-4xl m-auto text-center p-2">
          <header className="text-5xl font-mono">jerni</header>
          <span className="text-lg font-serif">
            a framework to build data-driven products from the ground up
          </span>
        </h1>

        {children}
      </div>
    </main>
  );
}
