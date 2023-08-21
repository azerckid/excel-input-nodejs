const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" }); // .env 파일을 읽어서 process.env에 설정합니다;
const url = process.env.MONGODB_URL;

const dbName = "hotelMaster";
const collectionName = "sanhaAccount"; // 필요에 따라 적절한 컬렉션 이름을 사용하세요.

const fetchDataFromMongoDB = async () => {
  let client;
  let result;

  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 모든 데이터를 조회
    result = await collection.find({}).toArray();
  } catch (err) {
    console.error("An error occurred while fetching data from MongoDB:", err);
  } finally {
    if (client) {
      client.close();
    }
  }
  console.log(result);
  return result;
};

const getDataAsJson = async () => {
  const data = await fetchDataFromMongoDB();
  console.log(data);

  return data.map((entry) => ({
    Account: entry.Account,
    AccountName: entry["Account Name"],
    MarketType: entry["Market Type"], // 실제 값이 필요합니다. 데이터에는 없으므로 예시값을 사용합니다.
    TotalRMS: entry["Total RMS"],
    ADR: entry["Total ADR"],
    TotalRevenue: entry["Total Revenue"],
  }));
};

// 실행하고 반환된 JSON 배열을 출력
(async () => {
  const jsonData = await getDataAsJson();
  console.log(jsonData);
})();
