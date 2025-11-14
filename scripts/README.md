# MongoDB Export Scripts

## Export Database (Node.js Script)

Use the Node.js script to export your MongoDB database to JSON files:

```bash
# Using npm script
npm run export:db

# Or directly
node scripts/export-mongodb.js

# Specify custom output directory
node scripts/export-mongodb.js ./backups
```

This will:
- Connect to your MongoDB database using the connection string from `.env.local`
- Export all collections to JSON files
- Create a timestamped export directory
- Generate a metadata file with export information

**Output structure:**
```
mongodb-export/
  export-2024-01-15T10-30-00-000Z/
    collection1.json
    collection2.json
    ...
    metadata.json
```

## Export Database (mongodump - Recommended for Production)

For production backups, use MongoDB's official `mongodump` tool:

### Install MongoDB Database Tools

**Windows:**
1. Download from: https://www.mongodb.com/try/download/database-tools
2. Extract and add to PATH

**macOS:**
```bash
brew install mongodb-database-tools
```

**Linux:**
```bash
# Ubuntu/Debian
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.9.4.tgz
tar -xzf mongodb-database-tools-*.tgz
export PATH=$PATH:$(pwd)/mongodb-database-tools-*/bin
```

### Export with mongodump

```bash
# Export entire database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/jia-db" --out=./backup

# Export specific collection
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/jia-db" --collection=collectionName --out=./backup

# Export with authentication (if needed)
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/jia-db?authSource=admin" --out=./backup
```

**Note:** Replace the connection string with your actual MongoDB URI from `.env.local`

### Import with mongorestore

To restore a backup:

```bash
# Restore entire database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/jia-db" ./backup/jia-db

# Restore specific collection
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/jia-db" --collection=collectionName ./backup/jia-db/collectionName.bson
```

## Which Method to Use?

- **Node.js Script (`export-mongodb.js`)**: 
  - Good for quick exports
  - Outputs human-readable JSON files
  - Easy to integrate into your workflow
  - Best for development/testing

- **mongodump**:
  - Official MongoDB tool
  - Faster for large databases
  - Preserves indexes and metadata
  - Binary format (BSON) - more efficient
  - Best for production backups

