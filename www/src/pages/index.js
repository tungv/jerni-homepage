import React from "react";

import CodeFile from "../components/CodeFile";
import HomeLayout from "../components/HomeLayout";
import Link from "next/link";

export default function JerniHomePage() {
  return (
    <HomeLayout>
      <div className="max-w-4xl m-auto text-center">
        <Link href="/tutorials/getting-started">
          <a className="border text-2xl px-12 py-4 rounded-full border-teal-500 hover:bg-teal-300 no-underline">
            Getting Started
          </a>
        </Link>
      </div>

      <section className="my-6 relative">
        <header className="max-w-4xl m-auto text-center">
          <h3 className="text-4xl lg:text-5xl font-cursive leading-none">
            Event-driven & Functional&nbsp;Projection
          </h3>
        </header>

        <p className="max-w-4xl m-auto text-xl font-serif p-2">
          <code>jerni</code> is built primarily on the concepts of{" "}
          <a
            href="https://martinfowler.com/eaaDev/EventSourcing.html"
            target="_blank"
          >
            Event Sourcing
          </a>{" "}
          and{" "}
          <a href="https://martinfowler.com/bliki/CQRS.html" target="_blank">
            CQRS
          </a>{" "}
          despite some differences from the mainstream implementations . It also
          embraces the functional programming techniques to simplify
          state-changing operations without sacrifice flexibility.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Event-Driven:</strong> You describe your business logic using
          a sequence of events. Those events are defined with the vocabulary of
          business users instead of technical terms to ensure the system is
          resilient to underlaying technological changes.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Functional Projection:</strong> Committed events are
          translated into storage layers' operations in order to persist
          changes. These translations are done in a functional manner. This
          guarantees you can always reproduce the state of your data at any
          point in time on any computer.
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
          <code>jerni</code> takes a few trade-offs in term of maximizing speed
          in order to ensure 2 important assumptions in data flow.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Strict Order:</strong> after being committed, each event will
          receive a globally monotonic increasing numerical ID. All processing
          is then strictly done following that order{" "}
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
          the past. Even when a server crashes, once <code>jerni</code> resumes
          (on that machine or where else), consistency is eventually restored.{" "}
          <em>Race conditions will never happen in projection stage</em>.
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

      <section className="my-6 relative">
        <header className="max-w-4xl m-auto text-center">
          <h3 className="text-4xl lg:text-5xl font-cursive leading-none">
            Developer Experience
          </h3>
        </header>

        <p className="max-w-4xl m-auto text-xl font-serif p-2">
          <code>jerni</code> comes together with{" "}
          <a href="https://npm.im/jerni-dev">
            <code>jerni-dev</code>
          </a>{" "}
          &mdash; a set of dev-tools to ease the development workflow locally.{" "}
          <code>jerni-dev</code> also includes test helpers to make integration
          tests less of a hassle.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Hot Reload Logic:</strong> Once you save a file defining a
          projection logic, <code>jerni-dev</code> will automatically reload,
          and your storage layers will immediately reflect the changes. If your
          want the change to later apply in production, simply change the
          version of the model, and in the next deployment, your production data
          will reflect.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Hot Reload Data:</strong> If you commit an event by mistake,
          you can browse the list of local events to modify or remove that
          event. Again, if a valid change is made to the list of events, your
          local database will immediately reflect that. It's like rewrite the
          history, which is forbidden in production but commonly desired in
          development.
        </p>

        <p className="max-w-4xl m-auto text-lg font-serif p-1 px-6">
          <strong>Test Instance:</strong> You don't have to set up and tear down
          an external <code>jerni</code> or even <code>jerni-dev</code> process
          in order to write integration tests. An in-memory instance will
          seamlessly wrap your code and dispose on your request.
        </p>

        <p className="max-w-4xl m-auto text-xl font-serif p-2">
          We want you to feel comfortable developing your product. Say good-bye
          to the microservices nightmare local setup and focus on the modules
          that you are working on.
        </p>

        <div className="grid grid-cols-1 max-w-6xl  items-start gap-4 mt-2 mx-auto">
          <style jsx>{`
            @media all and (min-width: 1680px) {
              .grid {
                max-width: 2000px;
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
          `}</style>
          <div>
            <h3 className="text-xl text-center">Helpful Error Message</h3>
            <CodeFile language="text">
              <span>journey is ready!</span>
              <span>Example app listening at http://localhost:3000</span>
              <span>
                <span className="rounded bg-red-700 text-white text-bold">
                  {" "}
                  jerni-dev{" "}
                </span>{" "}
                invalid jerni server provided, received: .
              </span>
              <br></br>
              <span>
                {"  "}
                <span className="text-gray-500">1)</span> if you're in{" "}
                <span className="text-green-500 text-bold">development</span>{" "}
                mode, make sure you ran jerni-dev.
              </span>
              <span>
                {"  "}
                <span className="text-gray-500">2)</span> if you're in{" "}
                <span className="text-green-500 text-bold">production</span>{" "}
                mode, please set{" "}
                <span className="text-bold text-white">
                  NODE_ENV=production
                </span>{" "}
                before starting your app
              </span>
            </CodeFile>
          </div>
          <div>
            <h3 className="text-xl text-center">Detailed Event logging</h3>
            <CodeFile language="text">
              <span>
                <span className="text-white bg-green-700 rounded">
                  {" "}
                  jerni-dev{" "}
                </span>{" "}
                running in development mode
              </span>
              <br />
              <span>versions:</span>
              <span>
                {"  "}jerni:{"     "}
                <span className="text-white text-bold">1.0.0</span>
              </span>
              <span>
                {"  "}jerni-dev:{" "}
                <span className="text-white text-bold">1.0.0</span>
              </span>
              <br />
              <span>heq-server:</span>
              <span>
                {"  "}original URL:{" "}
                <span className="italic text-gray-500">undefined</span> (not
                used in development mode)
              </span>
              <span>
                {"  "}dev server URL:{" "}
                <span className="itatic text-green-500 underline">
                  http://localhost:6181
                </span>
              </span>
              <br />
              <span>stores:</span>
              <span>
                {"  "}-{" "}
                <span className="itatic text-green-500 underline">
                  mongodb://localhost:27017
                </span>
              </span>
              <br />
              <br />
              <span>
                <span className="text-white bg-green-700 rounded">
                  {" "}
                  jerni-dev{" "}
                </span>{" "}
                event{" "}
                <span className="text-white text-bold">
                  #1 [type=ACCOUNT_CREATED]
                </span>{" "}
                has been committed to dev server at{" "}
                <span className="itatic text-green-500 underline">
                  http://localhost:6181
                </span>
              </span>
            </CodeFile>
          </div>
          <div>
            <h3 className="text-xl text-center">Intelligent File Watcher</h3>
            <CodeFile language="text">
              <span>
                [ cli ] <span className="text-green-500">info</span>: heq-server
                is listening on port 6181
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: writing
                lockfile to .jerni-dev
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: clean
                start new journey
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: worker
                ready
              </span>
              <span>
                [jerni] <span className="text-green-500">info</span>: start
                receiving data
              </span>
              <span>
                [jerni] <span className="text-green-500">info</span>:{" "}
                {`[ { accounts_v1: { added: 1 } } ]`}
              </span>
              <br />
              <span>
                [ cli ] <span className="text-yellow-500">warn</span>:
                non-organic change detected!
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: stop
                watching data file
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: jerni
                subprocess stopped!
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: stopped
                watching journey source code!
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: heq-server
                subprocess stopped!
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: lockfile
                .jerni-dev removed!
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: heq-server
                is listening on port 6181
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: writing
                lockfile to .jerni-dev
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: clean
                start new journey
              </span>
              <span>
                [ cli ] <span className="text-green-500">info</span>: worker
                ready
              </span>
              <span>
                [jerni] <span className="text-green-500">info</span>: start
                receiving data
              </span>
              <span>
                [jerni] <span className="text-green-500">info</span>:{" "}
                {`[ { accounts_v1: { added: 2 } } ]`}
              </span>
            </CodeFile>
          </div>
        </div>
      </section>

      <section className="my-6 relative">
        <header className="max-w-4xl m-auto text-center">
          <h3 className="text-4xl lg:text-5xl font-cursive leading-none">
            Forward Compatible
          </h3>
        </header>

        <p className="max-w-4xl m-auto text-xl font-serif p-2">
          As of today, <code>jerni</code> uses{" "}
          <a href="https://redis.io/" target="_blank">
            Redis
          </a>{" "}
          as its events store and officially provides{" "}
          <a href="https://npm.im/@jerni/store-mongo" target="_blank">
            a MongoDB store
          </a>{" "}
          for projections. However, we are actively developing other adapters
          like PostgreSQL for events store and a projection for{" "}
          <a href="https://neo4j.com/" target="_blank">
            Neo4J Graph Database
          </a>
          .
        </p>

        <p className="max-w-4xl m-auto text-xl font-serif p-2">
          <code>jerni</code> is built around an open protocol based on the
          standard HTTP. That makes supports for languagues other than
          JavaScript is possible. We want to keep the API surface compact so new
          clients/adapters integration would be simple.
        </p>
      </section>
    </HomeLayout>
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
const journey = require('./journey.js');

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
const { Model } = require('@jerni/store-mongo');
const mapEvents = require('jerni/lib/mapEvents');

module.exports = new Model({
  name: 'accounts',
  transform: mapEvents({
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
const journey = require('./journey.js');

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
module.exports = new Model({
  name: 'accounts',
  transform: mapEvents({
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
