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
      type: ["MongoDbReadModel"],
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
            type: "MongoDbReadModel",
            optional: true,
          },
        ],
        returns: { type: "MongoDbReadOnlyCollection" },
      },
      examples: [
        {
          code: `
const usersModel = require('../journey/models/users');

/* ... */
const UsersCollection = await journey.getReader(usersModel);
const someUser = await UsersCollection.findOne({ id: '1000' });
`,
        },
      ],
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
            type: ["jerni", "CommittedEvent"],
          },
        ],
        returns: { type: ["MongoDbOperation"] },
      },
    },
  ],
};

const MongoDbReadModel = {
  name: "MongoDbReadModel",
  extends: ["jerni", "DataModel"],
  description: "Encapsulate projection logic for a MongoDB Collection",
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
    {
      name: "collectionName",
      type: "string",
      description: "getter for the underlaying collection name",
      examples: [
        {
          fileName: "journey/models/users.js",
          code: `
const { Model } = require("@jerni/store-mongo");

const userModel = new Model({
  name: "users",
  version: "3",
  transform(event) { /* ... */ }
});

console.log(userModel.collectionName);
          `,
          result: `"users_v3"`,
        },
      ],
    },
  ],
};

const StoreMongoDefaultExport = {
  name: "StoreMongoDefaultExport",
  extends: "Object",
  properties: [
    {
      name: "makeStore",
      type: "function",
      fn: {
        params: [
          {
            name: "config",
            type: "MongoDbStoreConfig",
            description: "MongoDB Store specific configuration",
          },
        ],
        returns: { type: "MongoDbStore" },
      },
      description: "create a MongoDbStore instance from given configuration",
      examples: [
        {
          fileName: "journey/my-mongo-store.js",
          code: `
/* ... */
await makeMongoDbStore({
  name: 'MyServices',
  url: 'mongodb://localhost:27017',
  dbName: 'my_service_dev',
  models: [clients, profiles],
});`,
        },
      ],
    },
    {
      name: "Model",
      type: "Class",
      classOf: "MongoDbReadModel",
      description: "Encapsulate projection logic for a MongoDB Collection",
    },
    {
      name: "readPipeline",
      type: "function",
      fn: {
        params: [
          {
            name: "model",
            type: "MongoDbReadModel",
            optional: true,
          },
          {
            name: "pipeline",
            type: ["PipelineOperation"],
          },
        ],
        returns: {
          type: "MongoDBAggregationResults",
        },
      },
      description:
        "Declaratively read data from a collection during projection stage",

      examples: [
        {
          fileName: "example-count-with-condition.js",
          code: `
/* transform function for Profiles model */        
function transform(event) {
  const results = readPipeline([
    { $match: { age: { $gte: 18 } } },
    { $count: 'adultsCount' },
  ]);
  
  // if $match doesn't find any document, next stage will receive empty stream,
  // thus $count stage will just return empty stream as well
  const count = result.length === 0 ? 0 : result[0].adultsCount;

  // decide what to do depending on the value of count
  if (count > 3) {
    return [ /* ... */ ];
  }

  return [ /* ... */ ];
}
        `,
        },
        {
          fileName: "example-lookup-different-collection.js",
          code: `
const ProductModel = new Model(/* ... */);

const OrderModel = new Model({
  name: "orders",
  version: "1",
  transform(event) {

    // readPipeline can run conditionally
    if (event.type === "ORDER_MADE") {
      const { product_ids, order_id } = event.payload;

      // readPipeline can run repetatively in a loop
      const unitPrices = product_ids.map(id => {

        // readPipeline can run agaist other models as well
        return readPipeline(ProductModel, [
          { $match: { id } },            // query a specific product
          { $project: { unitPrice: 1 } } // only get its price
        ])
      });

      // NOTE: don't do this in production, use one pipeline to map/reduce for better performance
      const total = unitPrices.reduce((a, b) => a + b);

      return [{
        insertOne: {
          id: order_id,
          products: product_ids,
          total
        }
      }]
    }
  }
})


/* transform function for Profiles model */        
function transform(event) {
  const results = readPipeline([
    { $match: { age: { $gte: 18 } } },
    { $count: 'adultsCount' },
  ]);
  
  // if $match doesn't find any document, next stage will receive empty stream,
  // thus $count stage will just return empty stream as well
  const count = result.length === 0 ? 0 : result[0].adultsCount;

  // decide what to do depending on the value of count
  if (count > 3) {
    return [ /* ... */ ];
  }

  return [ /* ... */ ];
}
        `,
        },
      ],
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
  MongoDbReadModel,
  StoreMongoDefaultExport,
  MongoDbOperation,
  MongoDbReadOnlyCollection,
];

export default storeMongoTypes;
