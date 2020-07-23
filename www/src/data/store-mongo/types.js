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
            type: ["UncommittedEvent"],
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

const jerniTypes = [MongoDbStoreConfig, MongoDBReadModel, MongoDbOperation];

export default jerniTypes;
