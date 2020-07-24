export default [
  {
    path: "",
    referredName: "mongoDbAdapter",
    type: "StoreMongoDefaultExport",
    description:
      "get all utilities for syncing data from Events Queue to MongoDB",
    examples: [`const { makeStore, Model, readPipeline } = mongoDbAdapter;`],
  },
  {
    path: "/Model",
    referredName: "Model",
    type: "Class",
    classOf: "MongoDBReadModel",
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
      returns: { type: "MongoDbStore" },
    },
    description: "create a MongoDbStore instance from given configuration",
    examples: [
      `await makeMongoDbStore({
  name: 'MyServices',
  url: 'mongodb://localhost:27017',
  dbName: 'my_service_dev',
  models: [clients, profiles],
});`,
    ],
  },
  {
    path: "/readPipeline",
    referredName: "readPipeline",
    type: "function",
    fn: {
      params: [
        {
          name: "model",
          type: "MongoDBReadModel",
          optional: true,
          description:
            "if specified, this is the model to run aggregation pipeline against. The current model is aggregated otherwise",
        },
        {
          name: "pipeline",
          type: ["PipelineOperation"],
          description: "an array of MongoDB pipeline stages",
        },
      ],
      returns: {
        type: "MongoDBAggregationResults",
      },
    },
    description:
      "Declaratively read data from a collection during projection stage",

    examples: [
      `
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
}`,
      `
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
    ],
  },
];
