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

        <p>
          To verify this step, you can run this bash script in your terminal at
          the project root directory, given you have your local mongodb server
          listening on its default port
        </p>

        <CodeFile
          language="bash"
          outputLanguage="text"
          code={`MONGODB_URL=mongodb://localhost:27017 MONGODB_DBNAME=banks ${
            useYarn
              ? "yarn jerni-dev start ./journey"
              : "npx jerni-dev start ./journey"
          }`}
          result={`[ cli ] info: jerni-dev.start({ version: '1.0.0' })
[ cli ] info:  * source file: /path/to/your/my-first-jerni-project/banks/journey
[ cli ] info:  * options { http: 6181, verbose: false, dataPath: 'jerni.db' }
[ cli ] info: checking integrity of data file since last start
[ cli ] info: heq-server is listening on port 6181
[ cli ] info: writing lockfile to .jerni-dev
[ cli ] info: clean start new journey
[ cli ] info: worker ready
[jerni] info: start receiving data
jerni-dev>`}
        ></CodeFile>

        <p>
          You can use <kbd>Ctrl-C</kbd> to terminate this process
        </p>
      </section>

      <section className="w-full max-w-4xl m-auto p-2 grid grid-cols-1 gap-2">
        <header>
          <h3 className="text-2xl">Commit Event</h3>
        </header>

        <p>
          First, we need to create an <code>express</code> app to listen on port
          3000.
        </p>

        <CodeFile language="bash">
          {useYarn ? `yarn add express` : `npm i express`}
        </CodeFile>

        <p>
          Then create a <code>server.js</code> file at project root directory,
          with the following content:
        </p>
        <CodeFile fileName="server.js" language="js">
          {`
const express = require("express");
const app = express();
const port = 3000;

app.get("/api/accounts", (req, res) => {
  res.send([]);
});

app.post("/api/accounts", express.json(), async (req, res) => {
  const { name, currency } = req.body;
  const id = Math.trunc(Math.random() * 1e11) + 1e12;

  res.send({ name, balance: { [currency]: 0 }, id });
});


app.listen(port, () =>
  console.log(\`Example app listening at http://localhost:$\{port\}\`),
);
`}
        </CodeFile>

        <p>And finally start the app by running this bash script in terminal</p>

        <CodeFile
          language="bash"
          code={`node server.js`}
          result={`Example app listening at http://localhost:3000`}
        ></CodeFile>

        <p>
          Leaving this process running, in another terminal, let run a quick
          test to see if it works
        </p>

        <p>GET</p>
        <CodeFile
          language="bash"
          outputLanguage="json"
          code={`curl localhost:3000/api/accounts`}
          result={`[]`}
        ></CodeFile>

        <p>POST</p>

        <CodeFile
          language="bash"
          outputLanguage="json"
          code={`
curl -XPOST localhost:3000/api/accounts \\
     -H"content-type: application/json" \\
     -d '{"name":"test", "currency":"USD"}'`}
          result={`{"name":"test","balance":{"USD":0},"id":1014151097134}`}
        ></CodeFile>

        <p>
          Nothing fancy yet, now let's initialize <code>jerni</code> to our
          server.
        </p>

        <CodeFile language="js">
          {`
/* ... */
app.post("/api/accounts", express.json(), async (req, res) => {
  const { name, currency } = req.body;
  const id = Math.trunc(Math.random() * 1e11) + 1e12;

  await journey.commit({
    type: "ACCOUNT_CREATED",
    payload: { id, account_name: name, currency },
  });

  res.send({ name, balance: { [currency]: 0 }, id });
});
/* ... */
`}
        </CodeFile>

        <p>
          Restart express server, and try to <code>POST /api/accounts</code>{" "}
          again
        </p>

        <CodeFile
          language="bash"
          code={`
curl -XPOST localhost:3000/api/accounts \\
     -H"content-type: application/json" \\
     -d '{"name":"test", "currency":"USD"}'`}
          result={`curl: (52) Empty reply from server`}
        ></CodeFile>

        <p>You will see a new line of message</p>

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
            <span className="text-green-500 text-bold">development</span> mode,
            make sure you ran jerni-dev.
          </span>
          <span>
            {"  "}
            <span className="text-gray-500">2)</span> if you're in{" "}
            <span className="text-green-500 text-bold">production</span> mode,
            please set{" "}
            <span className="text-bold text-white">NODE_ENV=production</span>{" "}
            before starting your app
          </span>
        </CodeFile>

        <p>
          jerni-dev It prompts you to run <code>jerni-dev</code>. Open another
          terminal (this is your last terminal to open) and run:
        </p>

        <CodeFile
          language="bash"
          outputLanguage="text"
          code={`MONGODB_URL=mongodb://localhost:27017 MONGODB_DBNAME=banks ${
            useYarn
              ? "yarn jerni-dev start ./journey"
              : "npx jerni-dev start ./journey"
          }`}
          result={`[ cli ] info: jerni-dev.start({ version: '1.0.0' })
[ cli ] info:  * source file: /path/to/your/my-first-jerni-project/banks/journey
[ cli ] info:  * options { http: 6181, verbose: false, dataPath: 'jerni.db' }
[ cli ] info: checking integrity of data file since last start
[ cli ] info: heq-server is listening on port 6181
[ cli ] info: writing lockfile to .jerni-dev
[ cli ] info: clean start new journey
[ cli ] info: worker ready
[jerni] info: start receiving data
jerni-dev>`}
        ></CodeFile>

        <p>
          Restart express server, and try to <code>POST /api/accounts</code>{" "}
          again
        </p>

        <CodeFile
          language="bash"
          outputLanguage="json"
          code={`
curl -XPOST localhost:3000/api/accounts \\
     -H"content-type: application/json" \\
     -d '{"name":"test", "currency":"USD"}'`}
          result={`{"name":"test","balance":{"USD":0},"id":1024340236565}`}
        ></CodeFile>

        <p>
          Notice the messages from <code>express</code> server terminal:
        </p>

        <CodeFile language="text">
          <span>
            <span className="text-white bg-green-700 rounded"> jerni-dev </span>{" "}
            running in development mode
          </span>
          <br />
          <span>versions:</span>
          <span>
            {"  "}jerni:{"     "}
            <span className="text-white text-bold">1.0.0</span>
          </span>
          <span>
            {"  "}jerni-dev: <span className="text-white text-bold">1.0.0</span>
          </span>
          <br />
          <span>heq-server:</span>
          <span>
            {"  "}original URL:{" "}
            <span className="italic text-gray-500">undefined</span> (not used in
            development mode)
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
            <span className="text-white bg-green-700 rounded"> jerni-dev </span>{" "}
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

        <p>
          You have successfully committed your first jerni event. To double
          check, open the file <code>jerni.db</code> that <code>jerni-dev</code>{" "}
          has created. You will see this:
        </p>

        <CodeFile language="text" fileName="jerni.db">
          {`### BEGIN checksum: e07846fb1760381ec374b65a9ccc1605 ###
{"type":"ACCOUNT_CREATED","payload":{"id":1024340236565,"account_name":"test","currency":"USD"},"meta":{"occurred_at":1595144407458,"client":"jerni-banks-demo","clientVersion":"1.0.0"}}`}
        </CodeFile>

        <div className="p-4 border-l-4 border-green-500 bg-green-100 grid grid-cols-1 gap-4">
          <p>
            <b>Note:</b> whether or not to include this file to source control
            is up to you.
          </p>
          <p>
            We recommend to commit this file to source control. However, review
            the diff before you commit to make sure it contains only useful
            seeding data for the next developer to begin with.
          </p>
        </div>
      </section>
    </HomeLayout>
  );
}
