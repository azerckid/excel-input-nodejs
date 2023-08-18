const fs = require("fs");
const xlsx = require("xlsx");
const lunetAccountTransformData = require("./transformData/lunetAccount.js");

const { MongoClient } = require("mongodb");
const MONGO_URL =
  "mongodb://admin:1234@svc.sel3.cloudtype.app:31947/?authMechanism=DEFAULT"; // 몽고디비 URL
const DB_NAME = "hotelMaster"; // 사용할 데이터베이스 이름
const COLLECTION_NAME = "lunetAccountData"; // 사용할 컬렉션 이름

const insertDataToMongoDB = async (data) => {
  let client;

  try {
    client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });
    console.log("Connected successfully to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert the data
    const result = await collection.insertMany(data);
    console.log(
      `Inserted ${result.insertedCount} documents into the ${COLLECTION_NAME} collection`
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
  "../inputData/lunetAccountSales Products by Account_20230106.xls",
  {
    codepage: 949,
  }
); // 액샐 파일 읽어오기
const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름 가져오기
const firstSheet = workbook.Sheets[firstSheetName];

const lunetAccount = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });
const lunetAccountResult = lunetAccountTransformData(lunetAccount);
// console.log(lunetAccountResult);

xlsx.writeFile(workbook, "../xlsxResult/lunetAccount.xlsx");
fs.writeFileSync(
  "../txtResult/lunetAccount.txt",
  JSON.stringify(lunetAccountResult, null, 2),
  "utf8"
);

insertDataToMongoDB(lunetAccountResult);
