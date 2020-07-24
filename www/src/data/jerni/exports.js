export default [
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
          description:
            "an object with keys are event types and values are projection functions",
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
];
