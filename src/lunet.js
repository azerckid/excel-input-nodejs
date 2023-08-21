const fs = require("fs");
const xlsx = require("xlsx");

const lunetTransformData = require("./transformData/lunetTrans.js");
const insertDataToMongoDB = require("./dataBase/insertDataDB.js");

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

const dbName = "hotelMaster";
const collectionName = "lunet"; // Replace with your desired collection name, e.g., 'rooms', 'bookings', etc.
insertDataToMongoDB(lunetResult, dbName, collectionName);
