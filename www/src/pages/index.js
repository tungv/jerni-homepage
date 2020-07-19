import Link from "next/link";
import Head from "next/head";
import React from "react";

import CodeFile from "../components/CodeFile";

export default function JerniHomePage() {
  return (
    <main className="m-2 lg:m-12">
      <Head>
        <title>
          jerni - a framework to build data-driven products from the ground up
        </title>
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
            <Link href="/Blogs">
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

        <section className="my-6 relative">
          <header className="max-w-4xl m-auto text-center">
            <h3 className="text-4xl lg:text-5xl font-cursive leading-none">
              Event-driven & Functional&nbsp;Projection
            </h3>
          </header>

          <p className="max-w-4xl m-auto text-xl font-serif p-2">
            jerni is built primarily on the concepts of{" "}
            <a
              href="https://martinfowler.com/eaaDev/EventSourcing.html"
              target="_blank"
            >
              Event Sourcing
            </a>{" "}
            and{" "}
            <a href="https://martinfowler.com/bliki/CQRS.html" target="_blank">
              CQRS
            </a>
            . It also embraces the functional programming techniques to simplify
            state-changing operations without sacrifice flexibility.
          </p>

          <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
            <strong>Event-Driven:</strong> You describe your business logic
            using a sequence of events. Those events are defined with the
            vocabulary of business users instead of technical terms to ensure
            the system is resilient to underlaying technological changes.
          </p>

          <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
            <strong>Functional Projections:</strong> Events are translated into
            technical terms in order to interact with storage layers. These
            translations are done in a functional manner. This guarantees you
            can always reproduce the state of your data at any point in time.
          </p>

          <div>
            <EventFlow
              app={
                <CodeFile
                  fileName="controllers/accounts.js"
                  code={EVENT_DRIVEN_APP_JS}
                />
              }
              job={
                <CodeFile
                  fileName="models/accounts.js"
                  code={EVENT_DRIVEN_JOB_JS}
                />
              }
            />
          </div>
        </section>

        <section className="my-6 relative">
          <header className="max-w-4xl m-auto text-center">
            <h3 className="text-4xl lg:text-5xl font-cursive leading-none">
              Strict&nbsp;Order & Exactly&nbsp;Once Delivery
            </h3>
          </header>

          <p className="max-w-4xl m-auto text-xl font-serif p-2">
            jerni takes a few trade-offs in term of maximizing speed in order to
            ensure 2 important assumptions in data flow.
          </p>

          <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
            <strong>Strict Order:</strong> after being committed, each event
            will receive a globally monotonic increasing numerical ID. All
            processing is then strictly done following that order{" "}
            <b>No Matter What&trade;</b>
          </p>

          <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
            <strong>Exactly Once Delivery:</strong> Never have to worry about
            missing or duplicate events. Events are not only come in order but
            also come once and only once. However, right when you need to, they
            are there for you to re-run just like the first time.
          </p>

          <p className="max-w-4xl m-auto text-xl font-serif p-2">
            With these 2 assumptions combined, pessimistic locking is a thing in
            the past. Even when in a server crashing situation, once it resumes,
            consistency is eventually restored.
          </p>

          <div>
            <EventFlow
              app={
                <CodeFile
                  fileName="controllers/transactions.js"
                  code={STRICT_ORDER_APP_JS}
                />
              }
              job={
                <CodeFile
                  fileName="models/accounts.js"
                  code={STRICT_ORDER_JOB_JS}
                />
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function EventFlow(props) {
  const { app, job } = props;

  return (
    <div className="grid items-center p-0 md:px-2 m-auto">
      <style jsx>{`
        @media all and (max-width: 1679px) {
          .grid {
            max-width: max(800px, 52rem);
            grid-template-rows: repeat(3, auto);
          }

          .horizontal {
            display: none;
          }

          .vertical {
            max-width: 100vw;
          }
        }

        @media all and (min-width: 1680px) {
          .grid {
            max-width: 2000px;
            grid-template-columns: minmax(500px, 800px) minmax(300px, 1fr) minmax(
                500px,
                800px
              );
          }

          .vertical {
            display: none;
          }
        }

        .code {
          max-width: 100%;
          overflow: auto;
        }
      `}</style>
      <div className="code p-0 md:p-2">{app}</div>
      <div className="horizontal flex flex-row items-center">
        <img
          src="/events-flow.png"
          alt="events are sent through an events queue"
        />
      </div>
      <div className="vertical flex flex-col items-center">
        <img
          width={120}
          src="/events-flow-vertical.png"
          alt="events are sent through an events queue"
        />
      </div>
      <div className="code px-0 py-4 md:p-2">{job}</div>
    </div>
  );
}

const EVENT_DRIVEN_APP_JS = `
import journey from './journey.js';

// to make a change, commit an event
await journey.commit({
  type: "ACCOUNT_CREATED",
  payload: {
    id: "8aud23jm",
    account_name: "Alice",
    currency: "USD",
  }
});
`;

const EVENT_DRIVEN_JOB_JS = `
import { Model } from '@jerni/store-mongo';
import mapEvents from 'jerni/lib/mapEvents';

export default new Model({
  name: 'accounts',
  transform: handleEvents({
    ACCOUNT_CREATED(event) {
      return {
        insertOne: {
          id: event.payload.id,
          name: event.payload.account_name,
          balance: {
            [event.payload.currency]: 0
          }
        }
      }
    }
  })
})
`;

const STRICT_ORDER_APP_JS = `
import journey from './journey.js';

// committed events are assigned with an ID
const event = await journey.commit({
  type: "MONEY_SENT",
  payload: {
    src: "8aud23jm",
    dest: "aot42lfe",
    amount: 100,
    src_currency: "USD",
    dest_currency: "EUR",
    rate: 0.88,
  }
});
`;

const STRICT_ORDER_JOB_JS = `
export default new Model({
  name: 'accounts',
  transform: handleEvents({
    ACCOUNT_CREATED(event) { /* ... */ },
    MONEY_SENT(event) {
      const {
        src,
        dest,
        amount,
        rate,
        src_currency,
        dest_currency,
      } = event.payload;

      return [
        {
          updateOne: {
            where: { id: src },
            changes: {
              $inc: {
                [\`balance.$\{src_currency\}\`]: amount * -1
              }
            }
          }
        },
        {
          updateOne: {
            where: { id: dest },
            changes: {
              $inc: {
                [\`balance.$\{dest_currency\}\`]: amount * rate
              }
            }
          }
        },
      ]
    }
  })
})
`;
