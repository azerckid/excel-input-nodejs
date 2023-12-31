const { MongoClient } = require("mongodb");

// MongoDB connection URL
require("dotenv").config({ path: "../.env" }); // .env 파일을 읽어서 process.env에 설정합니다;
const url = process.env.MONGODB_URL;

// Database and Collection Names
const dbName = "hotelMaster";
const collectionName = "sanha"; // 변경해야 할 수도 있습니다.

const fetchSpecificFieldsByDate = async () => {
  let client;

  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 필요한 필드만 가져오기 위해 프로젝션을 사용합니다.
    const projection = {
      _id: 0,
      Date: 1,
      Day: 1,
      FITADR: 1,
      FITRevenue: 1,
      GroupRms: 1,
      GroupADR: 1,
    };

    const data = await collection.find({}, { projection }).toArray();

    return data;
  } catch (err) {
    console.error(
      "An error occurred while fetching specific fields data from MongoDB:",
      err
    );
    return [];
  } finally {
    if (client) {
      client.close();
    }
  }
};

// 특정 필드 데이터를 Date별로 변환하여 JSON 배열로 반환하는 함수입니다.
const getSpecificFieldsByDateAsJson = async () => {
  const data = await fetchSpecificFieldsByDate();

  return data.map((item) => ({
    Date: item.Date,
    Day: item.Day,
    FITADR: item.FITADR,
    FITRevenue: item.FITRevenue,
    GroupRms: item.GroupRms,
    GroupADR: item.GroupADR,
  }));
};

// 함수를 호출하고 반환된 JSON 배열을 출력합니다.
(async () => {
  const jsonData = await getSpecificFieldsByDateAsJson();
  console.log(jsonData);
})();
