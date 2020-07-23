const pkgs = [
  {
    pkgName: "jerni",
    exports: [
      {
        path: "",
        referredName: "createJourney",
        type: "function",
        description: "create a Journey object with a given configurations",
        fn: {
          async: true,
          params: [
            {
              type: "JourneyConfig",
              name: "config",
              description: "configuration to create a journey",
            },
          ],
          returns: {
            type: "Journey",
          },
        },
      },
      {
        path: "/lib/mapEvents",
        referredName: "mapEvents",
        type: "function",
        description: "utility function to map an event type to a event handler",
        fn: {
          params: [
            {
              type: "Record",
              name: "handlersMap",
              record: {
                key: { type: "string", name: "eventName" },
                value: {
                  type: "function",
                  name: "handler",
                  description:
                    "project an event of a specific type to store's operations",
                  fn: {
                    params: [{ type: "UncommittedEvent" }],
                    returns: { type: { union: ["Operation", ["Operation"]] } },
                  },
                },
              },
            },
          ],
          returns: {
            type: "function",
            fn: {
              params: [{ type: "UncommittedEvent" }],
              returns: { type: ["Operation"] },
            },
          },
        },
        examples: [
          `const transform = mapEvents({
  USER_REGISTERED(event) {
    return {
      insertOne: {
        id: event.payload.id,
        username: event.payload.username,
        createdAt: event.payload.registered_timstamp,
        active: true,
      },
    };
  }
  USER_SUSPENDED(event) {
    return {
      updateOne: {
        where: { id: event.payload.user_id },
        changes: {
          $set: { active: false },
        },
      },
    };
  },
});`,
        ],
      },
      {
        path: "/skip",
        referredName: "SKIP",
        type: "SkipSymbol",
        description:
          "SKIP symbol to explicitly ignore an exception during projection stage",
        examples: [
          `const journey = createJourney({
  writeTo: 'http://some-server.com',
  stores: [/* ... */],
  async onError(err, event) {
    // we don't need to handle error for this event because …
    if (event.type === "SOME_EVENT") {
      return SKIP;
    }
  }
});`,
        ],
      },
    ],
    types: [
      {
        name: "JourneyConfig",
        extends: "Object",
        description: "Describe a journey configuration",
        properties: [
          {
            type: "string",
            name: "writeTo",
            description: "events queue server address",
            examples: [
              "http://localhost:6181",
              "http://192.168.1.117:9000",
              "http://jerni.dev/project/1001472",
            ],
          },
          {
            name: "stores",
            type: ["Store"],
            description: "List of all destinations of this journey",
            examples: [{ ref: ["@jerni/store-mongo", "MongoStore"] }],
          },
          {
            name: "onError",
            type: "function",
            fn: {
              async: true,
              params: [
                {
                  name: "error",
                  type: "Error",
                },
                {
                  name: "event",
                  type: "CommittedEvent",
                },
              ],
              returns: {
                type: {
                  union: ["SkipSymbol", "void"],
                },
              },
            },
            description:
              "this callback is triggered on every uncaught exception thrown in projection stage. To ignore an error, you need to explicitly return jerni/skip symbol",
            examples: [
              {
                lanugage: "js",
                fileName: "log-error-sentry.js",
                code: `
const journey = createJourney({
  writeTo: 'http://some-server.com',
  stores: [/* ... */],
  async onError(err, event) {
    if (SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setLevel('fatal');
        scope.setFingerprint(['{{ default }}', 'journey']);
        scope.setExtra('offendingEvent', event);

        if (err.name === 'JerniStoreMongoWriteError') {
          scope.setExtra('mongo_code', err.code);
          scope.setExtra('mongo_op', JSON.stringify(err.op));
          scope.setExtra('model', err.model);
        }

        Sentry.captureException(err);
      });

      await Sentry.flush(5000);
    }
  }
});`,
              },
              {
                lanugage: "js",
                fileName: "skip-error.js",
                code: `
const journey = createJourney({
  writeTo: 'http://some-server.com',
  stores: [/* ... */],
  async onError(err, event) {
    // we don't need to handle error for this event because …
    if (event.type === "SOME_EVENT") {
      return require('jerni/skip');
    }
  }
});`,
              },
            ],
          },
        ],
      },
      {
        name: "Journey",
        extends: "Object",
        properties: [
          {
            name: "commit",
            type: "function",
            description:
              "commits an event to the Events Queue and returns that committed event after it's fully committed",
            fn: {
              async: true,
              params: [
                {
                  name: "eventShape",
                  type: "UncommitedEvent",
                },
              ],
              returns: {
                type: "CommittedEvent",
              },
            },
            examples: [
              {
                language: "js",
                fileName: "example.js",
                code: `
// t-0: start committing              
const event = await journey.commit({
  type: "EVENT_1",
  payload: {
    key: "value",
  },
});

console.log(event)
              `,
                result: `{
  id: 10001,
  type: "EVENT_1",
  payload: {
    key: "value"
  },
  meta: {
    /* custom meta data injected by \`jerni\` */
  }
}`,
              },
            ],
          },
          {
            name: "waitFor",
            type: "function",
            description:
              "waits for an event to be fully persisted to all stores of this journey",
            fn: {
              async: true,
              params: [
                {
                  name: "eventShape",
                  type: "CommittedEvent",
                },
              ],
              returns: {
                type: "void",
              },
            },
            examples: [
              {
                language: "js",
                fileName: "example.js",
                code: `
// t-0: start committing              
const event = await journey.commit({ /* ... */ });
// t-1: event has been written to Events Queue, but hasn't been projected to any store
await journey.waitFor(event)
// t-2: event has been fully projected to all stores
              `,
              },
            ],
          },
          {
            name: "getReader",
            type: "function",
            description:
              "return a read-only native data querying object depending on the underlaying store",
            fn: {
              async: true,
              params: [
                {
                  name: "model",
                  type: "DataModel",
                  optional: true,
                },
              ],
              returns: {
                type: "Reader",
              },
            },
            examples: [
              {
                language: "js",
                fileName: "example.js",
                code: `
const { Model } = require('@jerni/store-mongo');
const users = new Model({ /*...*/ });

/* ... */

const UserCollection = await journey.getReader(users);
const someUser = await UserCollection.findOne({ id: '123' });
              `,
              },
            ],
          },
        ],
      },
      {
        name: "Store",
        extends: "Object",
      },
      {
        name: "UncommittedEvent",
        extends: "Object",
      },
      {
        name: "CommittedEvent",
        extends: "Object",
      },
    ],
  },
];

export default pkgs;
