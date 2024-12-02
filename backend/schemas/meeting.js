use("Bookedin");

db.meeting.drop();

db.createCollection("meeting", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "hostID", "availabilities", "location", "status", "repeat", "createdAt", "updatedAt"],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 50
        },
        description: {
          bsonType: "string",
          minLength: 0,
          maxLength: 500
        },
        hostID: {
          bsonType: "objectId",
          description: "User ID or email of the host"
        },
        availabilities: {
          bsonType: "array", 
          description: "Array of availabilities for the meeting",
          items: {
            bsonType: "object",
            required: ["date", "slots", "max"],
            properties: {
              date: {
                bsonType: "string",
                pattern: "^\\d{4}-\\d{2}-\\d{2}$"  // YYYY-MM-DD format
              },
              slots: {
                bsonType: "object",
                patternProperties: {
                  "^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$": {
                    bsonType: "array",
                    items: {
                      bsonType: "object",
                      required: ["email", "firstName", "lastName"],
                      properties: {
                        email: {
                          bsonType: "string",
                          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", // also allows non-mcgill emails
                          description: "Participant email"
                        },
                        firstName: {
                          bsonType: "string",
                          description: "Participant first name"
                        },
                        lastName: {
                          bsonType: "string",
                          description: "Participant last name"
                        }
                      }
                    }
                  }
                },
                additionalProperties: false
              },
              max: {
                bsonType: "int",
                minimum: 1
              }
            }
          }
        },
        location: {
          bsonType: "string",
          maxLength: 50
        },
        status: {
          bsonType: "int",
          enum: [0, 1, 2, 3],  // 0=upcoming, 1=closed, 2=canceled, 3=voting
          description: "0=upcoming, 1=closed, 2=canceled, 3=voting"
        },
        repeat: {
          bsonType: "object",
          required: ["type", "endDate"],
          properties: {
            type: {
              bsonType: "int",
              enum: [0, 1],  // 0=once, 1=weekly
              description: "0=once, 1=weekly"
            },
            endDate: {
              bsonType: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$"  // YYYY-MM-DD format
            }
          }
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of meeting creation"
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update"
        }
      }
    }
  }
}); 