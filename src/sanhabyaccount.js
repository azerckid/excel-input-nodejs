const fs = require("fs");
const iconv = require("iconv-lite");
const xlsx = require("xlsx");

const transformData = require("./transformData/sanhaAccountTransform");
const insertDataToMongoDB = require("./dataBase/insertDataDB.js");

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

// Database Name
const dbName = "hotelMaster";
const collectionName = "sanhaAccount"; // Replace with your desired collection name, e.g., 'rooms', 'bookings', etc.
insertDataToMongoDB(sanhaAccount, dbName, collectionName);
