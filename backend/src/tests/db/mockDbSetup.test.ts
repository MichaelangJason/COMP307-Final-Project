import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { describe, test, expect, afterEach, beforeAll, afterAll } from "@jest/globals";

describe('MongoDB Memory Server Setup', () => {
    let mongoServer: MongoMemoryServer;
    let connection: MongoClient;
    let db: any;

    beforeAll(async () => {
        // Create MongoDB Memory Server
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Create connection
        connection = await MongoClient.connect(uri, {});
        db = connection.db("testdb");

        // Make db globally available to tests
        (global as any).__MONGO_URI__ = uri;
        (global as any).__MONGO_DB__ = db;
        (global as any).__MONGO_CONNECTION__ = connection;
    });

    afterAll(async () => {
        // Clean up
        expect(connection).toBeDefined();
        expect(mongoServer).toBeDefined();
        await connection.close();
        await mongoServer.stop();
    });

    //Clear all data between tests
    afterEach(async () => {
        if (db) {
            const collections = await db.collections();
            for (const collection of collections) {
                await collection.deleteMany({});
            }
        }
    });

    test('should connect to the in-memory database', async () => {
        expect(db).toBeDefined();
        expect(connection).toBeDefined();
    });

    test('should clear collections after each test', async () => {
        // Insert some test data
        await db.collection('test').insertOne({ test: 'data' });
        
        // Verify data was inserted
        let count = await db.collection('test').countDocuments();
        expect(count).toBe(1);
        
        // afterEach will run after this test, clearing the collection
    });
});