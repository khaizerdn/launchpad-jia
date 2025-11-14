/**
 * MongoDB Database Export Script
 * 
 * This script exports all collections from the MongoDB database to JSON files.
 * 
 * Usage:
 *   node scripts/export-mongodb.js [output-directory]
 * 
 * Example:
 *   node scripts/export-mongodb.js ./backups
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });
  
  return env;
}

const env = loadEnvFile();
const uri = process.env.MONGODB_URI || env.MONGODB_URI;
const dbName = 'jia-db';

if (!uri) {
  console.error('Error: MONGODB_URI not found in .env.local or environment variables');
  console.error('Please ensure MONGODB_URI is set in .env.local');
  process.exit(1);
}

async function exportDatabase() {
  const outputDir = process.argv[2] || './mongodb-export';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportPath = path.join(outputDir, `export-${timestamp}`);

  // Create export directory
  if (!fs.existsSync(exportPath)) {
    fs.mkdirSync(exportPath, { recursive: true });
  }

  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    console.log(`Connected to database: ${dbName}`);
    console.log(`Export directory: ${exportPath}\n`);

    // Get all collection names
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collection(s)\n`);

    // Export each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Exporting collection: ${collectionName}...`);

      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      // Write to JSON file
      const filePath = path.join(exportPath, `${collectionName}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify(documents, null, 2),
        'utf8'
      );

      console.log(`  ✓ Exported ${documents.length} document(s) to ${filePath}`);
    }

    // Create metadata file
    const metadata = {
      database: dbName,
      exportDate: new Date().toISOString(),
      collections: collections.map(c => c.name),
      totalCollections: collections.length,
    };

    fs.writeFileSync(
      path.join(exportPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf8'
    );

    console.log(`\n✓ Export completed successfully!`);
    console.log(`✓ Export location: ${exportPath}`);

  } catch (error) {
    console.error('Error exporting database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\nConnection closed.');
    }
  }
}

exportDatabase();

