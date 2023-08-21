const fs = require("fs");
const xlsx = require("xlsx");
const lunetAccountTransformData = require("./transformData/lunetAccountTransform.js");
const insertDataToMongoDB = require("./dataBase/insertDataDB.js");

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

const DB_NAME = "hotelMaster"; // 사용할 데이터베이스 이름
const COLLECTION_NAME = "lunetAccount"; // 사용할 컬렉션 이름
insertDataToMongoDB(lunetAccountResult, DB_NAME, COLLECTION_NAME);
