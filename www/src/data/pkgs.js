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
              "commit an event to events queue and return that committed event after it's fully persisted",
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
