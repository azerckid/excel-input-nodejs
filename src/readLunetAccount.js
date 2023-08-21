const { MongoClient } = require("mongodb");

const url =
  "mongodb://admin:1234@svc.sel3.cloudtype.app:31947/?authMechanism=DEFAULT";
const dbName = "hotelMaster";
const collectionName = "lunetAccount"; // 필요에 따라 적절한 컬렉션 이름을 사용하세요.

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

  return result;
};

const getDataAsJson = async () => {
  const data = await fetchDataFromMongoDB();

  return data.map((entry) => ({
    Account: entry.Account,
    AccountName: entry.AccountName,
    MarketType: "MarketTypeValue", // 실제 값이 필요합니다. 데이터에는 없으므로 예시값을 사용합니다.
    TotalRMS: entry.Rooms.Nights,
    ADR: entry.ADR,
    TotalRevenue: entry.TotalRevenue,
  }));
};

// 실행하고 반환된 JSON 배열을 출력
(async () => {
  const jsonData = await getDataAsJson();
  console.log(jsonData);
})();
