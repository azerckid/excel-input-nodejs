const fs = require("fs");
const xlsx = require("xlsx");

const workbook = xlsx.readFile(
  "../inputData/lunetSales On The Book_20230106.xls",
  {
    codepage: 949,
  }
); // 액샐 파일 읽어오기
const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름 가져오기
const firstSheet = workbook.Sheets[firstSheetName];
// 첫번째 시트의 첫번째 행 삭제 (A1:B1)
// delete firstSheet["A1"];
// delete firstSheet["B1"];

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
const transformData = (lunet) => {
  const keys = lunet[1];
  const data = lunet.slice(2);

  const transformed = data.map((item) => {
    const obj = {
      Date: item.A,
      Day: item.B,
      FIT: {
        Date: item.A,
        Day: item.B,
        Rms: item.C,
        Ratio: item.D,
        ADR: item.E,
        Revenue: item.F,
      },
      Group: {
        Date: item.A,
        Day: item.B,
        Rms: item.H,
        Ratio: item.I,
        ADR: item.J,
        Revenue: item.K,
      },
      Total: {
        Date: item.A,
        Day: item.B,
        Rms: item.O,
        Ratio: 100, // Assuming the Ratio is always 100 for the Total
        ADR: item.Q,
        RevPAR: item.R,
        Revenue: item.S,
      },
    };
    return obj;
  });

  return transformed;
};

const lunetResult = transformData(secondSheetJson);
console.log(lunetResult);

// const testSheetJsonOut = transformData(secondSheetJson);
// console.log(testSheetJsonOut);

xlsx.writeFile(workbook, "../xlsxResult/lunet.xlsx");
fs.writeFileSync(
  "../txtResult/lunet.txt",
  JSON.stringify(lunetResult, null, 2),
  "utf8"
);
