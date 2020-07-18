import Link from "next/link";
import React from "react";

import CodeFile from "../components/CodeFile";

export default function JerniHomePage() {
  return (
    <main>
      <h1>
        <header>jerni</header>
        <span>a framework to build data-driven product from the ground up</span>
      </h1>

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

      <section>
        <header>
          <h3>Event-driven + Functional Projection</h3>
        </header>

        <div>
          <EventFlow
            app={<CodeFile fileName="app.js" code={EVENT_DRIVEN_APP_JS} />}
            job={
              <CodeFile
                fileName="models/accounts.js"
                code={EVENT_DRIVEN_JOB_JS}
              />
            }
          />
        </div>
      </section>

      <section>
        <header>
          <h3>Strictly Ordered + Exactly Once Delivery</h3>
        </header>

        <div></div>
      </section>
    </main>
  );
}

function EventFlow(props) {
  const { app, job } = props;

  return (
    <div>
      <div>{app}</div>
      <div>queue</div>
      <div>{job}</div>
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
