import React, { useReducer } from "react";

import CodeFile from "../../components/CodeFile";
import HomeLayout from "../../components/HomeLayout";

export default function GettingStartedPage() {
  const [useYarn, toggle] = useReducer((isYarn) => !isYarn, false);
  return (
    <HomeLayout title="jerni - Getting Started">
      <section className="w-full max-w-4xl m-auto p-2">
        <h2 className="text-3xl">
          Getting Started with <code>jerni</code>
        </h2>
        <p>In this tutorial, we will create an app with jerni and MongoDB.</p>
        <p>
          <strong>Prerequisites:</strong> Before you start, make sure your have
          node.js (version 12+) and mongodb (version 3.6+) installed on your
          machine.
        </p>
      </section>
      <section className="w-full max-w-4xl m-auto p-2 grid grid-cols-1 gap-2">
        <header>
          <h3 className="text-2xl">Installation</h3>
          <label className="flex items-center">
            <input type="checkbox" checked={useYarn} onChange={toggle} />
            <span className="m-2 select-none">
              I use <code>yarn</code>
            </span>
          </label>
        </header>

        <p>
          First and foremost, let create a folder for this new project. Open a
          terminal and run these bash code
        </p>

        <div>
          <CodeFile language="bash">
            {`
mkdir my-first-jerni-project
cd my-first-jerni-project
${useYarn ? `yarn init -y` : `npm init -y`}`}
          </CodeFile>
        </div>

        <p>You need to install jerni and MongoDB projection store packages.</p>

        <div>
          <CodeFile language="bash">
            {useYarn
              ? `yarn add jerni @jerni/store-mongo`
              : `npm i jerni @jerni/store-mongo`}
          </CodeFile>
        </div>

        <p>
          For better developer experience, please install <code>jerni-dev</code>{" "}
          as a dev dependency.
        </p>

        <div>
          <CodeFile language="bash">
            {useYarn ? `yarn add -D jerni-dev` : `npm i -D jerni-dev`}
          </CodeFile>
        </div>

        <p>
          To verify if you have install the packages correctly, open your{" "}
          <code>package.json</code> file, and you should be able to find this
          snippet (the actual versions may vary).
        </p>

        <CodeFile language="json" fileName="package.json">{`{
  "dependencies": {
    "@jerni/store-mongo": "^1.0.0",
    "jerni": "^1.0.0"
  },
  "devDependencies": {
    "jerni-dev": "^1.0.0"
  }
}`}</CodeFile>
      </section>

      <section className="w-full max-w-4xl m-auto p-2 grid grid-cols-1 gap-2">
        <header>
          <h3 className="text-2xl">Create a journey</h3>
        </header>
        <p>
          We need to declare our journey by specifying where the events store
          and your mongodb are.
        </p>

        <CodeFile language="js" fileName="journey/index.js">{`
const createJourney = require("jerni");
const { makeStore } = require("@jerni/store-mongo");

const accounts = require("./models/accounts");

module.exports = async function initialize() {
  return createJourney({
    writeTo: process.env.EVENTS_QUEUE_URL,
    stores: [
      await makeStore({
        name: "banks",
        url: process.env.MONGODB_URL,
        dbName: process.env.MONGODB_DBNAME,

        models: [accounts],
      }),
    ],
  });
};
`}</CodeFile>
        <CodeFile language="js" fileName="journey/models/accounts.js">{`
const { Model } = require("@jerni/store-mongo");
const mapEvents = require("jerni/lib/mapEvents");

module.exports = new Model({
  name: "accounts",
  version: "1",
  transform: mapEvents({
    ACCOUNT_CREATED(event) {
      return {
        insertOne: {
          id: event.payload.id,
          name: event.payload.account_name,
          balance: {
            [event.payload.currency]: 0,
          },
        },
      };
    },
  }),
});
`}</CodeFile>

        <p>
          We have declared a journey that will commit events to a server behind
          the environment key <code>EVENTS_QUEUE_URL</code> and read projected
          data from a mongodb specified by <code>MONGODB_URL</code> and{" "}
          <code>MONGODB_DBNAME</code>.
        </p>

        <div className="p-4 border-l-4 border-green-500 bg-green-100 grid grid-cols-1 gap-4">
          <p>
            <strong>Note</strong>: we now have 2 different places for data to
            stay. This is under the effect of CQRS &mdash; Command&ndash;Query
            Responsibility Segregation. This architectural pattern optimizes for
            both write and read operations as each of them can be carried out by
            a specified tool. For example, we write data to an append-only queue
            in-memory (with disk dump) and read from a denormalized mongodb
            database.
          </p>
          <p>
            Don't be confused, there is only one source of truth and it's the
            events queue. The mongodb stores are only projections. Similar to
            Views in SQL, they are derived from the sequence of events.
          </p>
        </div>
      </section>
    </HomeLayout>
  );
}
