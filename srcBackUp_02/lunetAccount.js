const fs = require("fs");
const xlsx = require("xlsx");

const workbook = xlsx.readFile(
  "../inputData/lunetAccountSales Products by Account_20230106.xls",
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
const transformData = (data) => {
  // Use slice(2) to skip the first two metadata rows
  return data.slice(2).map((entry) => {
    return {
      Account: entry.A,
      AccountName: entry.B,
      TotalRevenue: entry.C,
      RoomRevenue: entry.D,
      ADR: entry.E,
      RoomRevenue: {
        FIT: entry.F,
        Group: entry.G,
      },
      Rooms: {
        Nights: entry.H,
        NoShow: entry.I,
        Cancel: entry.J,
        Booking: entry.K,
      },
      Guests: entry.L,
      Food: entry.M,
      Beverage: entry.N,
      Other: entry.O,
      SVC: entry.P,
      Tax: entry.Q,
    };
  });
};

const lunetAccountResult = transformData(secondSheetJson);
console.log(lunetAccountResult);

// const lunetResult = transformData(secondSheetJson);
// console.log(lunetResult);

// const testSheetJsonOut = transformData(secondSheetJson);
// console.log(testSheetJsonOut);

xlsx.writeFile(workbook, "../xlsxResult/lunetAccount.xlsx");
fs.writeFileSync(
  "../txtResult/lunetAccount.txt",
  JSON.stringify(lunetAccountResult, null, 2),
  "utf8"
);
