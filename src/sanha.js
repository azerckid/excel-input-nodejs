const fs = require("fs");
const xlsx = require("xlsx");
const transformData = require("./transformData/sanhaTransform");
// const insertDataToMongoDB = require("./insertDataToMongoDB");

const { MongoClient } = require("mongodb");

// MongoDB connection URL - This should be moved to an environment variable or a config file for security and flexibility
const url =
  "mongodb://admin:1234@svc.sel3.cloudtype.app:31947/?authMechanism=DEFAULT";

// Database Name
const dbName = "hotelMaster";
const collectionName = "sanha"; // Replace with your desired collection name, e.g., 'rooms', 'bookings', etc.

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
  "../inputData/sanha속초 컨피네스 비치 호텔_20230105.xls",
  {
    codepage: 949,
  }
); // 액샐 파일 읽어오기
const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름 가져오기
const firstSheet = workbook.Sheets[firstSheetName];
// 첫번째 시트의 첫번째 행 삭제 (A1:B1)
delete firstSheet["A1"];
delete firstSheet["B1"];

// 두번째 행을 key 값으로 하는 json 오브젝트를 생성
const secondSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });
console.log(secondSheetJson);

const sanhaResult = transformData(secondSheetJson);
console.log(sanhaResult);

xlsx.writeFile(workbook, "../xlsxResult/sanha.xlsx");
fs.writeFileSync(
  "../txtResult/sanha.txt",
  JSON.stringify(sanhaResult, null, 2),
  "utf8"
);

insertDataToMongoDB(sanhaResult);
