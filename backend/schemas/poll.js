
use("Bookedin");

db.poll.drop();

db.createCollection("poll", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["options", "timeout", "results", "createdAt", "updatedAt"],
      properties: {
        options: {
          bsonType: "array",
          minItems: 1,
          description: "Array of options for the poll",
          items: {
            bsonType: "object",
            description: "Option for the poll",
            required: ["date", "slots"],
            properties: {
              date: {
                bsonType: "string",
                pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                description: "Date of the option"
              },
              slots: {
                bsonType: "object",
                patternProperties: {
                  "^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$": {
                    bsonType: "int",
                    minimum: 0,
                    description: "Number of votes for the slot"
                  }
                },
                additionalProperties: false // no other keys allowed
              }
            }
          }
        },
        timeout: {
          bsonType: "date",
          description: "Timeout for the poll"
        },
        results: {
          bsonType: "int",
          minimum: 1,
          description: "Number of final results"
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of poll creation"
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update"
        }
      }
    }
  }
})