import Link from "next/link";
import React from "react";

import CodeFile from "../components/CodeFile";

export default function JerniHomePage() {
  return (
    <main className="m-12">
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>home</a>
            </Link>
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
        <h1 className="mb-4">
          <header className="text-5xl font-mono">jerni</header>
          <span className="text-lg font-serif">
            a framework to build data-driven product from the ground up
          </span>
        </h1>

        <section className="my-6">
          <header className="max-w-4xl m-auto text-center">
            <h3 className="text-5xl">Event-driven + Functional Projection</h3>
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

        <section className="my-6">
          <header className="max-w-4xl m-auto text-center">
            <h3 className="text-5xl">
              Strict Order &amp; Exactly Once Delivery
            </h3>
          </header>

          <p className="max-w-4xl m-auto text-xl font-serif p-2">
            jerni takes a few trade-offs in term of maximizing speed in order to
            ensure 2 important assumptions in data flow. Pessimistic locking is
            a thing in a past.
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

          <div>
            <EventFlow
              app={
                <CodeFile
                  fileName="controllers/accounts.js"
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
    <div className="flex flex-row items-center max-w-full">
      <div className="flex-1">{app}</div>
      <div className="">
        <img
          width={300}
          src="/events-flow.png"
          alt="events are sent through an events queue"
        />
      </div>
      <div className="flex-1">{job}</div>
    </div>
  );
}

const EVENT_DRIVEN_APP_JS = `
import journey from './journey.js';

// to make a change, commit an event
await journey.commit({
  type: "ACCOUNT_CREATED",
  payload: { id: "8aud23jm", account_name: "Alice" }
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
          balance: 0
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
      } = event.payload;
      
      return [
        {
          updateOne: {
            where: { id: src },
            changes: {
              $inc: { balance: amount * -1 }
            }
          }
        },
        {
          updateOne: {
            where: { id: dest },
            changes: {
              $inc: { balance: amount * rate }
            }
          }
        },
      ]
    }
  })
})
`;
