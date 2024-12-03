
use("Bookedin");

db.request.drop();

db.createCollection("request", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["proposedSlot", "status", "createdAt", "updatedAt"],
      properties: {
        proposedSlot: {
          bsonType: "object",
          description: "Proposed time slot, only one for now",
          required: ["date", "time"],
          properties: {
            date: {
              bsonType: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$"
            },
            time: {
              bsonType: "string",
              pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$"
            }
          }
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
