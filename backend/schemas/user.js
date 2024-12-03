use("Bookedin");

db.user.drop();
db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "firstName", "lastName", "role", "notifications", "upcomingMeetings", "hostedMeetings", "requests", "createdAt", "updatedAt"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@(mail\.)?mcgill\.ca$",
          description: "User's email address which must be a valid McGill email"
        },
        password: {
          bsonType: "string",
          minLength: 8,
          maxLength: 16,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,16}$',
          description: "User's password, max 16 characters"
        },
        firstName: {
          bsonType: "string",
          maxLength: 16,
          description: "User's first name, max 16 characters"
        },
        lastName: {
          bsonType: "string",
          maxLength: 16,
          description: "User's last name, max 16 characters"
        },
        role: {
          bsonType: "int",
          enum: [0, 1],
          description: "0=admin, 1=member"
        },
        notifications: {
          bsonType: "object",
          required: ["email", "sms", "alarm"],
          properties: {
            email: {
              bsonType: "bool"
            },
            sms: {
              bsonType: "bool"
            },
            alarm: {
              bsonType: "int",
              enum: [0, 1, 2, 3, 4],
              description: "0=1 min, 1=5 min"
            }
          }
        },
        upcomingMeetings: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Meeting IDs as ObjectId references"
          }
        },
        hostedMeetings: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Meeting IDs as ObjectId references"
          }
        },
        requests: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Request IDs as ObjectId references"
          }
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of user creation"
        },
        updatedAt: {
          bsonType: "date", 
          description: "Timestamp of last update"
        }
      }
    }
  }
});
