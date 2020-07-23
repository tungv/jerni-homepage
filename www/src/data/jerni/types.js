const Journey = {
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
            type: "UncommittedEvent",
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
        returns: { type: "void" },
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
};

const JourneyConfig = {
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
};

const UncommittedEvent = {
  name: "UncommittedEvent",
  extends: "Object",
  properties: [
    {
      name: "type",
      type: "string",
      description:
        "Event type described using business vocabulary and in past form of a verb",
      examples: [
        "USER_SUSPENED",
        "ACCOUNT_REGISTED",
        "INTERNAL_TRANSACTION_MADE",
        "LICENSE_EXPIRED",
      ],
    },
    {
      name: "payload",
      type: "Object",
      description:
        "An object to provide more information to explain the event. This payload must include all external/temporal data that cannot be reproduced in the future.",
      examples: [
        { payload: { ferex_rate: 0.88 } },
        { payload: { created_at: 1595497141257 } },
      ],
    },
  ],
};

const Store = {
  name: "Store",
  extends: "Object",

  properties: [
    {
      name: "meta",
      type: "StoreMetaData",
      description:
        "metadata of the store, can be used for analyses and optimizations",
    },
    { name: "name", type: "string", description: "name of the store" },
    {
      name: "registerModels",
      type: "function",
      description:
        "internal use: lets a store register its models for getReader(model) to work.",
      fn: {
        async: true,
        params: [
          {
            name: "modelMap",
            type: "Record",
            record: {
              key: { type: "DataModel", name: "model" },
              value: { type: "Store", name: "store" },
            },
          },
        ],
        returns: { type: "void" },
      },
    },
    {
      name: "getDriver",
      type: "function",
      description: "internal use: returns native data query object",
      fn: {
        async: true,
        params: [
          {
            name: "Model",
            type: "DataModel",
            optional: true,
          },
        ],
        returns: { type: "NativeReadOnlyDriver" },
      },
    },
    {
      name: "handleEvents",
      type: "function",
      description:
        "projects a batch of events into a batch of storage layer's operations, and idempotently apply those operations",
      fn: {
        async: true,
        params: [
          {
            name: "events",
            type: ["CommittedEvent"],
          },
        ],
        returns: { type: ["Operation"] },
      },
    },
    {
      name: "getLastSeenId",
      type: "function",
      description: "returns the last fully persisted ID",
      fn: { async: true, params: [], returns: { type: "number" } },
    },
    {
      name: "listen",
      type: "function",
      description:
        "returns an async iterable that yields with the latest fully persisted ID",
      fn: {
        asyncGenerator: true,
        params: [],
        returns: { type: "number" },
      },
    },
    {
      name: "clean",
      type: "function",
      description: "cleans up storage layer. No effect in production mode",
      fn: { async: true, params: [], returns: { type: "void" } },
    },
    {
      name: "toString",
      type: "function",
      description: "returns a human-readable representation of the store",
      fn: { params: [], returns: { type: "string" } },
    },
    {
      name: "dispose",
      type: "function",
      description:
        "cleans up all resouces created by this store instance. This will not clean up any data in storage layer",
      fn: { async: true, params: [], returns: { type: "void" } },
    },
  ],
};

const DataModel = {
  name: "DataModel",
  extends: "Object",
  description:
    "Generic type for a data model in a store with more than one of them.",
  properties: [
    {
      name: "name",
      type: "string",
      description:
        "name of the model. Usually used to name the underlaying storage structure",
    },
    {
      name: "version",
      type: "string",
      description:
        "version of the model. This enables the ability to run multiple versions of a model to avoid down-time in migrations",
    },
    {
      name: "transform",
      type: "function",
      description:
        "functionally transfrom an event into a list of database operations. This will not have the ability to read the event's ID",
      fn: {
        async: true,
        params: [
          {
            name: "events",
            type: ["UncommittedEvent"],
          },
        ],
        returns: { type: ["Operation"] },
      },
    },
  ],
};

const NativeReadOnlyDriver = {
  name: "NativeReadOnlyDriver",
  extends: "Object",
  description: "Generic type for stores with more than one models",
};
const Operation = {
  name: "Operation",
  extends: "Object",
  description:
    "Generic type for storage layer operation. Eg. INSERT, UPDATE, DELETE for SQL RDBMS or insertOne, updateMany, replaceMany, etc. for MongoDB",
};

const StoreMetaData = {
  name: "StoreMetaData",
  extends: "Object",
  properties: [
    {
      name: "includes",
      type: ["string"],
      description: "Array of event types this store consumes",
    },
  ],
};

const CommittedEvent = {
  name: "CommittedEvent",
  extends: "Object",
  properties: [
    {
      name: "id",
      type: "number",
      description:
        "Automatically assigned ID for each committed event. These IDs are monotonically increasing numbers",
    },
    ...UncommittedEvent.properties,
  ],
};

const SkipSymbol = {
  name: "SkipSymbol",
  extends: "Symbol",
  description:
    "Special symbol to explicitly ignore an uncaughtException during projection stage",
};

const jerniTypes = [
  JourneyConfig,
  Journey,
  UncommittedEvent,
  CommittedEvent,
  Store,
  StoreMetaData,
  DataModel,
  NativeReadOnlyDriver,
  Operation,
  SkipSymbol,
];

export default jerniTypes;
