const fs = require("fs");
const xlsx = require("xlsx");
const lunetTransformData = require("./transformData/lunetTrans.js");

const { MongoClient } = require("mongodb");

// MongoDB connection URL - This should be moved to an environment variable or a config file for security and flexibility
const url =
  "mongodb://admin:1234@svc.sel3.cloudtype.app:31947/?authMechanism=DEFAULT";

// Database Name
const dbName = "hotelMaster";
const collectionName = "lunet"; // Replace with your desired collection name, e.g., 'rooms', 'bookings', etc.

const insertDataToMongoDB = async (data) => {
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

const workbook = xlsx.readFile(
  "../inputData/lunetSales On The Book_20230106.xls",
  {
    codepage: 949,
  }
);
const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름 가져오기
const firstSheet = workbook.Sheets[firstSheetName];

const lunet = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });
const lunetResult = lunetTransformData(lunet);
console.log(lunetResult);

xlsx.writeFile(workbook, "../xlsxResult/lunet.xlsx");
fs.writeFileSync(
  "../txtResult/lunet.txt",
  JSON.stringify(lunetResult, null, 2),
  "utf8"
);

// Your existing code...

console.log(lunetResult);

// Insert the transformed data to MongoDB
insertDataToMongoDB(lunetResult);

// Your file writing code...
