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
        },
      },
    ],
    types: [
      {
        name: "JourneyConfig",
        extends: "Object",
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
            type: "stores",
            extends: ["Store"],
            description: "List of all destinations of this journey",
            examples: [{ ref: ["@jerni/store-mongo", "MongoStore"] }],
          },
        ],
      },
      {
        name: "Journey",
        extends: "Object",
        description:
          "commit an event to events queue and return that committed event after it's fully persisted",
        properties: [
          {
            name: "commit",
            type: "function",
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
