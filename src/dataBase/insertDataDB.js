const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" }); // .env 파일을 읽어서 process.env에 설정합니다;

const url = process.env.MONGODB_URL;

const insertDataToMongoDB = async (data, dbName, collectionName) => {
  let client;

  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the data
    const result = await collection.insertMany(data);
    console.log(
      `Inserted ${result.insertedCount} documents into the ${collectionName} collection`
    );
  } catch (err) {
    console.error("An error occurred while inserting data to MongoDB:", err);
  } finally {
    if (client) {
      client.close();
    }
  }
};

module.exports = insertDataToMongoDB;
