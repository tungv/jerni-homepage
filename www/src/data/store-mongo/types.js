const MongoDbStoreConfig = {
  name: "MongoDbStoreConfig",
  extends: "Object",
  properties: [
    { name: "name", type: "string", description: "name of the store" },
    {
      name: "url",
      type: "string",
      description: "mongodb connection string (without database name)",
      examples: ["mongodb://localhost:27017"],
    },
    { name: "dbName", type: "string", description: "mongodb database name" },
    {
      name: "models",
      type: ["MongoDBReadModel"],
      description: "list of mongodb models, order doesn't matter",
    },
  ],
};

const MongoDbStore = {
  name: "MongoDbStore",
  extends: ["jerni", "Store"],
  properties: [
    {
      name: "getDriver",
      type: "function",
      description:
        "internal use: returns a read-only version of native mongodb collection object",
      fn: {
        async: true,
        params: [
          {
            name: "Model",
            type: "MongoDbReadOnlyModel",
            optional: true,
          },
        ],
        returns: { type: "MongoDbReadOnlyCollection" },
      },
    },
    {
      name: "handleEvents",
      type: "function",
      description:
        "projects a batch of events into a batch of mongodb write operations, and idempotently apply those operations",
      fn: {
        async: true,
        params: [
          {
            name: "events",
            type: ["CommittedEvent"],
          },
        ],
        returns: { type: ["MongoDbOperation"] },
      },
    },
  ],
};

const MongoDBReadModel = {
  name: "MongoDBReadModel",
  extends: ["jerni", "DataModel"],
  properties: [
    {
      name: "transform",
      type: "function",
      description:
        "functionally transfrom an event into a list of MongoDB write operations. This will not have the ability to read the event's ID",
      fn: {
        async: true,
        params: [
          {
            name: "events",
            type: ["jerni", "UncommittedEvent"],
          },
        ],
        returns: { type: ["MongoDbOperation"] },
      },
    },
  ],
};

const MongoDbOperation = {
  name: "MongoDbOperation",
  extends: "Object",
};

const MongoDbReadOnlyCollection = {
  name: "MongoDbReadOnlyCollection",
  extends: "Object",
};

const storeMongoTypes = [
  MongoDbStoreConfig,
  MongoDbStore,
  MongoDBReadModel,
  MongoDbOperation,
  MongoDbReadOnlyCollection,
];

export default storeMongoTypes;
