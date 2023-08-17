const fs = require("fs");
const xlsx = require("xlsx");

const workbook = xlsx.readFile(
  "./inputData/sanha속초 컨피네스 비치 호텔_20230105.xls",
  {
    codepage: 949,
  }
); // 액샐 파일 읽어오기
const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름 가져오기
const firstSheet = workbook.Sheets[firstSheetName];
// 첫번째 시트의 첫번째 행 삭제 (A1:B1)
delete firstSheet["A1"];
delete firstSheet["B1"];

const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet);

// 두번째 행을 key 값으로 하는 json 오브젝트를 생성
const secondSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: "A" });
console.log(secondSheetJson);
//첫번째 요소에 각 값들을 키로 하고 다음 요소의 값들을 키의 값으로 하는 json 오브젝트를 생성
// const thirdSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });
// console.log(thirdSheetJson);
// header를 키로 하고 나머지 요소들을 키의 값으로 하는 json 오브젝트를 생성
// const fourthSheetJson = xlsx.utils.sheet_to_json(firstSheet, { header: ["A"] });
// console.log(fourthSheetJson);
const transformData = (data) => {
  const headers = data[0];
  //   console.log(headers);
  return data.slice(1).map((row) => {
    let transformedRow = {};
    for (let key in headers) {
      // 헤더 값을 사용해 새로운 키 이름을 생성합니다. (예: "FIT Rms" -> "FITRms")
      //   let newKey = headers[key]
      //     .split(" ")
      //     .join("")
      //     .replace(".", "")
      //     .replace("%", "");
      // 한글깨짐 수정
      let newKey = headers[key].replace(/[\s.%]/g, "");
      transformedRow[newKey] = row[key];
    }
    return transformedRow;
  });
};

const testSheetJsonOut = transformData(secondSheetJson);
console.log(testSheetJsonOut);

xlsx.writeFile(workbook, "./xlsxResult/sanha.xlsx");
fs.writeFileSync(
  ".txtResult/sanha.txt",
  JSON.stringify(testSheetJsonOut, null, 2),
  "utf8"
);
