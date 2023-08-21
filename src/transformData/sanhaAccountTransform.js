const transformData = (data) => {
  const headers = data[2];
  return data.slice(3).map((row) => {
    let transformedRow = {};
    for (let key in headers) {
      let newKey = headers[key];
      transformedRow[newKey] = row[key];
    }
    return transformedRow;
  });
};

module.exports = transformData;
