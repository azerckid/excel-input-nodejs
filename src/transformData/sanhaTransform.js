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

module.exports = transformData;
