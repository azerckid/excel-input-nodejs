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

xlsx.writeFile(workbook, "./xlsxResult/lunet.xlsx");
fs.writeFileSync(
  "./txtResult/lunet.txt",
  JSON.stringify(lunetResult, null, 2),
  "utf8"
);

const lunet = [
  { A: "Date", C: "FIT", H: "Group", M: "Total", T: "" },
  {
    A: "Date",
    B: "Day",
    C: "Rms",
    D: "Ratio(%)",
    E: "ADR",
    F: "Revenue",
    G: "Ratio(%)",
    H: "Rms",
    I: "Ratio(%)",
    J: "ADR",
    K: "Revenue",
    L: "Ratio(%)",
    M: "House Use",
    N: "Comp",
    O: "Rms",
    P: "Occ(%)",
    Q: "ADR",
    R: "RevPAR",
    S: "Revenue",
  },
  {
    A: "2022-12-01",
    B: "Thu",
    C: 56,
    D: 72.7,
    E: 36625,
    F: 2050985,
    G: 86.7,
    H: 21,
    I: 27.3,
    J: 15000,
    K: 315000,
    L: 13.3,
    M: 0,
    N: 0,
    O: 77,
    P: 87.5,
    Q: 30727,
    R: 26886,
    S: 2365985,
    T: "",
  },
  {
    A: "2022-12-02",
    B: "Fri",
    C: 67,
    D: 76.1,
    E: 52309,
    F: 3504719,
    G: 91.8,
    H: 21,
    I: 23.9,
    J: 15000,
    K: 315000,
    L: 8.3,
    M: 0,
    N: 0,
    O: 88,
    P: 100,
    Q: 43406,
    R: 43406,
    S: 3819719,
    T: "",
  },
];

const lunetResutl = [
  {
    Date: "2022-12-01",
    Day: "Thu",
    FIT: {
      Date: "2022-12-01",
      Day: "Thu",
      Rms: 56,
      Ratio: 72.7,
      ADR: 36625,
      Revenue: 2050985,
    },
    Group: {
      Date: "2022-12-01",
      Day: "Thu",
      Rms: 21,
      Ratio: 27.3,
      ADR: 15000,
      Revenue: 315000,
    },
    Total: {
      Date: "2022-12-01",
      Day: "Thu",
      Rms: 77,
      Ratio: 100,
      ADR: 30727,
      RevPAR: 26886,
      Revenue: 2365985,
    },
  },

  {
    Date: "2022-12-02",
    Day: "Fri",
    FIT: {
      Date: "2022-12-02",
      Day: "Fri",
      Rms: 67,
      Ratio: 76.1,
      ADR: 52309,
      Revenue: 3504719,
    },
  },
  {
    Group: {
      Date: "2022-12-02",
      Day: "Fri",
      Rms: 21,
      Ratio: 23.9,
      ADR: 15000,
      Revenue: 315000,
    },
  },
  {
    Total: {
      Date: "2022-12-02",
      Day: "Fri",
      Rms: 88,
      Ratio: 100,
      ADR: 43406,
      RevPAR: 43406,
      Revenue: 3819719,
    },
  },
];
