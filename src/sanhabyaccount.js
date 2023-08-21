const fs = require("fs");
const iconv = require("iconv-lite");
const xlsx = require("xlsx");
const transformData = require("./transformData/sanhaAccountTransform");

const { MongoClient } = require("mongodb");

// MongoDB connection URL - This should be moved to an environment variable or a config file for security and flexibility
require("dotenv").config({ path: "../.env" }); // .env 파일을 읽어서 process.env에 설정합니다;
const url = process.env.MONGODB_URL;

// Database Name
const dbName = "hotelMaster";
const collectionName = "sanhaAccount"; // Replace with your desired collection name, e.g., 'rooms', 'bookings', etc.

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

// 파일을 cp949 인코딩으로 읽고 utf8로 변환합니다.
const buffer = fs.readFileSync("../inputData/sanhabyaccount20230105.xls");
const utf8Buffer = iconv.encode(iconv.decode(buffer, "cp949"), "utf8");

// 변환된 버퍼로 XLS 파일을 읽습니다.
const workbook = xlsx.read(utf8Buffer, { type: "buffer" });

const firstSheetName = workbook.SheetNames[0];
const firstSheet = workbook.Sheets[firstSheetName];

const secondSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });

const sanhaAccount = transformData(secondSheetJson);

console.log(sanhaAccount);

// 결과를 파일로 저장합니다.
xlsx.writeFile(workbook, "../xlsxResult/sanhabyaccount.xlsx");
fs.writeFileSync(
  "../txtResult/sanhabyaccount.txt",
  JSON.stringify(sanhaAccount, null, 2),
  "utf8"
);

insertDataToMongoDB(sanhaAccount);
