// One-time migration: copy all data from the source DB to 'PingDB', then
// drop the source DB and the empty 'chat' DB.
// Run with:  npm run db:migrate

const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongoose").mongo;

const TARGET_DB = "PingDB";
const CLEANUP_DBS = ["chat", "test"]; // databases to drop after migration

// Strip the database segment from the URI to get a cluster-level connection.
const BASE_URI = process.env.MONGO_URI.replace(/\/[^/?]+(\?|$)/, "/$1");

async function migrateDB() {
  const client = new MongoClient(BASE_URI);

  try {
    await client.connect();
    console.log("Connected to Atlas cluster.\n");

    const { databases } = await client.db().admin().listDatabases();
    const userDBs = databases
      .map(d => d.name)
      .filter(n => !["admin", "local", "config"].includes(n));

    console.log(`Databases found: ${userDBs.join(", ")}\n`);

    // Find the source DB — whichever of 'test' or 'chat' actually has data.
    let sourceDB = null;
    let sourceDBName = null;

    for (const name of ["test", "chat"]) {
      if (!userDBs.includes(name)) continue;
      const cols = await client.db(name).listCollections().toArray();
      if (cols.length > 0) {
        sourceDBName = name;
        sourceDB = client.db(name);
        console.log(`Source database: '${name}' (${cols.length} collection(s))\n`);
        break;
      }
    }

    if (!sourceDB) {
      console.log("No data found in 'test' or 'chat'. Nothing to migrate.");
      console.log("The app is already configured to use PingDB.");
      return;
    }

    // --- Migrate ---
    const targetDB = client.db(TARGET_DB);
    const collections = await sourceDB.listCollections().toArray();

    for (const { name } of collections) {
      const docs = await sourceDB.collection(name).find({}).toArray();

      if (docs.length === 0) {
        console.log(`  ${name}: empty, skipped.`);
        continue;
      }

      const result = await targetDB.collection(name).insertMany(docs, { ordered: false });
      console.log(`  ${name}: copied ${result.insertedCount} / ${docs.length} document(s).`);
    }

    console.log(`\nAll data migrated to '${TARGET_DB}'.`);

    // --- Cleanup ---
    for (const name of CLEANUP_DBS) {
      if (!userDBs.includes(name)) continue;
      await client.db(name).dropDatabase();
      console.log(`Dropped database '${name}'.`);
    }

    console.log("\nDone. PingDB is now the active database.");
  } finally {
    await client.close();
  }
}

migrateDB().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
