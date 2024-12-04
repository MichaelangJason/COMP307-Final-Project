export const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "email",
        "password",
        "firstName",
        "lastName",
        "role",
        "notifications",
        "upcomingMeetings",
        "hostedMeetings",
        "requests",
        "createdAt",
        "updatedAt",
      ],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@(mail.)?mcgill.ca$",
          description:
            "User's email address which must be a valid McGill email",
        },
        password: {
          bsonType: "string",
          minLength: 8,
          maxLength: 16,
          pattern:
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,16}$",
          description: "User's password, max 16 characters",
        },
        firstName: {
          bsonType: "string",
          maxLength: 16,
          description: "User's first name, max 16 characters",
        },
        lastName: {
          bsonType: "string",
          maxLength: 16,
          description: "User's last name, max 16 characters",
        },
        role: {
          bsonType: "int",
          enum: [0, 1],
          description: "0=admin, 1=member",
        },
        notifications: {
          bsonType: "object",
          required: ["email", "sms", "alarm"],
          properties: {
            email: {
              bsonType: "bool",
            },
            sms: {
              bsonType: "bool",
            },
            alarm: {
              bsonType: "int",
              enum: [0, 1, 2, 3, 4],
              description: "0=1 min, 1=5 min",
            },
          },
        },
        upcomingMeetings: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Meeting IDs as ObjectId references",
          },
        },
        hostedMeetings: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Meeting IDs as ObjectId references",
          },
        },
        requests: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "objectId",
            description: "Request IDs as ObjectId references",
          },
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of user creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
    },
  },
};

export const meetingSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "title",
        "description",
        "hostI",
        "availabilities",
        "location",
        "status",
        "repeat",
        "createdAt",
        "updatedAt",
      ],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 50,
        },
        description: {
          bsonType: "string",
          minLength: 0,
          maxLength: 500,
        },
        hostId: {
          bsonType: "objectId",
          description: "User ID or email of the host",
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
                pattern: "^\\d{4}-\\d{2}-\\d{2}$", // YYYY-MM-DD format
              },
              slots: {
                bsonType: "object",
                patternProperties: {
                  "^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$":
                    {
                      bsonType: "array",
                      items: {
                        bsonType: "object",
                        required: ["email", "firstName", "lastName"],
                        properties: {
                          email: {
                            bsonType: "string",
                            pattern:
                              "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", // also allows non-mcgill emails
                            description: "Participant email",
                          },
                          firstName: {
                            bsonType: "string",
                            description: "Participant first name",
                          },
                          lastName: {
                            bsonType: "string",
                            description: "Participant last name",
                          },
                        },
                      },
                    },
                },
                additionalProperties: false,
              },
              max: {
                bsonType: "int",
                minimum: 1,
              },
            },
          },
        },
        location: {
          bsonType: "string",
          maxLength: 50,
        },
        status: {
          bsonType: "int",
          enum: [0, 1, 2, 3], // 0=upcoming, 1=closed, 2=canceled, 3=voting
          description: "0=upcoming, 1=closed, 2=canceled, 3=voting",
        },
        repeat: {
          bsonType: "object",
          required: ["type", "endDate"],
          properties: {
            type: {
              bsonType: "int",
              enum: [0, 1], // 0=once, 1=weekly
              description: "0=once, 1=weekly",
            },
            endDate: {
              bsonType: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$", // YYYY-MM-DD format
            },
          },
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of meeting creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
    },
  },
};

export const requestSchema = {
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
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            },
            time: {
              bsonType: "string",
              pattern:
                "^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$",
            },
          },
        },
        status: {
          bsonType: "int",
          enum: [0, 1, 2, 3],
          description: "0=pending, 1=accepted, 2=declined, 3=expired",
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp of request creation",
        },
        updatedAt: {
          bsonType: "date",
          description: "Timestamp of last update",
        },
      },
    },
  },
};
