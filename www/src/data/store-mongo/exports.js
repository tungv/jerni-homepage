export default [
  {
    path: "",
    referredName: "mongoDbAdapter",
    type: "StoreMongoDefaultExport",
    description:
      "get all utilities for syncing data from Events Queue to MongoDB",
    examples: [
      {
        code: `const { makeStore, Model } = mongoDbAdapter;`,
      },
    ],
  },
  {
    path: "/Model",
    referredName: "Model",
    type: "MongoDBReadModel",
    description: "DataModel subclass with specific MongoDB operations",
    examples: [
      `const userModel = new Model({
  name: "users",
  version: "1",
  transform(event) {
    if (event.type === "USER_REGISTERED") {
      return {
        insertOne: {
          id: event.payload.id,
          username: event.payload.username,
        },
      },
    },
  },
});`,
    ],
  },
  {
    path: "/makeStore",
    referredName: "makeMongoDbStore",
    type: "function",
    fn: {
      params: [
        {
          name: "config",
          type: "MongoDbStoreConfig",
          description: "MongoDB Store specific configuration",
        },
      ],
      returns: { type: "MongoDBStore" },
    },
    description: "create a MongoDBStore instance from given configuration",
    examples: [
      `await makeMongoDbStore({
  name: 'MyServices',
  url: 'mongodb://localhost:27017',
  dbName: 'my_service_dev',
  models: [clients, profiles],
});`,
    ],
  },
];
