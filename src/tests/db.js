const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createInstance = async () => {
    return await MongoMemoryServer.create();
}


//connect to db
module.exports.connect = async () => {
    const mongodb = await createInstance();
    const uri = await mongodb.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    };
    await mongoose.connect(uri, mongooseOpts);
}

// disconnect and close connection
module.exports.closeDatabase = async () => {
    const mongodb = await createInstance();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
}

//Clear the db, remove all data
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany;
    }
}