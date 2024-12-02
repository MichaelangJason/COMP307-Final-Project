
use("Bookedin");

db.request.drop();

db.createCollection("request", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["proposedSlot", "status", "createdAt", "updatedAt"],
      properties: {
        proposedSlot: {
          bsonType: "string",
          description: "Proposed time slot, only one for now"
        },
        status: {
          bsonType: "int",
          enum: [0, 1, 2, 3],
          description: "0=pending, 1=accepted, 2=declined, 3=expired"
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of request creation"
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update"
        }
      }
    }
  }
});
