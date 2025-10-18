const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('orders');

    // Get existing indexes
    console.log('\n📋 Current indexes on orders collection:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${JSON.stringify(index)}`);
    });

    // Drop all indexes except _id
    console.log('\n🗑️  Dropping indexes...');
    await collection.dropIndexes();
    console.log('✅ All indexes dropped (except _id)');

    // Recreate indexes programmatically
    console.log('\n🔧 Recreating indexes from schema...');
    
    await collection.createIndex({ orderNumber: 1 }, { unique: true, sparse: true });
    console.log('✅ Created: { orderNumber: 1 } (unique, sparse)');
    
    await collection.createIndex({ customer: 1, createdAt: -1 });
    console.log('✅ Created: { customer: 1, createdAt: -1 }');
    
    await collection.createIndex({ status: 1 });
    console.log('✅ Created: { status: 1 }');
    
    await collection.createIndex({ rider: 1 });
    console.log('✅ Created: { rider: 1 }');
    
    await collection.createIndex({ 'deliveryAddress.coordinates': '2dsphere' });
    console.log('✅ Created: { deliveryAddress.coordinates: 2dsphere }');

    // Verify new indexes
    console.log('\n📋 New indexes on orders collection:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)}`);
    });

    console.log('\n✨ Index fix completed successfully!');
    console.log('💡 Restart your server to see the changes.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
