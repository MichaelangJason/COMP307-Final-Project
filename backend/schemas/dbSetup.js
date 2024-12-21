// Jiaju Nie
const schemas = require("../src/tests/db/schemas");

// Check if collections exist and are empty
const collections = ["meeting", "poll", "request", "user"];
let shouldSetup = false;

// Check if database exists
const dbList = db.getMongo().getDBNames();
if (!dbList.includes("Bookedin")) {
  shouldSetup = true;
} else {
  // Check if all collections exist and are empty
  shouldSetup = collections.every(collection => {
    return !db.getCollectionNames().includes(collection) ||
      db.getCollection(collection).countDocuments() === 0;
  });
}

if (shouldSetup) {
  use("Bookedin");

  db.dropDatabase();
  
  db.createCollection("meeting", schemas.meetingSchema);
  db.createCollection("poll", schemas.pollSchema);
  db.createCollection("request", schemas.requestSchema);
  db.createCollection("user", schemas.userSchema);
  db.user.createIndex({ email: 1 }, { unique: true });

  print("Database setup completed");
} else {
  print("Database already exists and contains data - setup skipped");
}