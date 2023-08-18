const fs = require("fs");
const iconv = require("iconv-lite");
const xlsx = require("xlsx");

// 파일을 cp949 인코딩으로 읽고 utf8로 변환합니다.
const buffer = fs.readFileSync("./inputData/sanhabyaccount20230105.xls");
const utf8Buffer = iconv.encode(iconv.decode(buffer, "cp949"), "utf8");

// 변환된 버퍼로 XLS 파일을 읽습니다.
const workbook = xlsx.read(utf8Buffer, { type: "buffer" });

const firstSheetName = workbook.SheetNames[0];
const firstSheet = workbook.Sheets[firstSheetName];

// 첫번째 시트의 첫번째 행 삭제
delete firstSheet["A1"];
delete firstSheet["B1"];
delete firstSheet["A2"];
delete firstSheet["B2"];
delete firstSheet["A3"];
delete firstSheet["B3"];
delete firstSheet["A4"];
delete firstSheet["B4"];

const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet);
const secondSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });

const transformData = (data) => {
  const headers = data[0];
  return data.slice(1).map((row) => {
    let transformedRow = {};
    for (let key in headers) {
      let newKey = headers[key];
      transformedRow[newKey] = row[key];
    }
    return transformedRow;
  });
};

const testSheetJsonOut = transformData(secondSheetJson);

console.log(testSheetJsonOut);

// 결과를 파일로 저장합니다.
xlsx.writeFile(workbook, "./xlsxResult/sanhabyaccount.xlsx");
fs.writeFileSync(
  "./txtResult/sanhabyaccount.txt",
  JSON.stringify(testSheetJsonOut, null, 2),
  "utf8"
);
