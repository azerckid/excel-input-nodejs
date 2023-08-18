const { MongoClient } = require("mongodb");

// MongoDB connection URL
const url =
  "mongodb://admin:1234@svc.sel3.cloudtype.app:31947/?authMechanism=DEFAULT";

// Database and Collection Names
const dbName = "hotelMaster";
const collectionName = "lunet"; // 변경해야 할 수도 있습니다.

// const fetchDataFromMongoDB = async () => {
//   let client;

//   try {
//     client = await MongoClient.connect(url, { useUnifiedTopology: true });
//     console.log("Connected successfully to MongoDB");

//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Fetch all the data
//     const data = await collection.find().toArray();

//     return data;
//   } catch (err) {
//     console.error("An error occurred while fetching data from MongoDB:", err);
//     return [];
//   } finally {
//     if (client) {
//       client.close();
//     }
//   }
// };

// // Fetch and print data from MongoDB
// const displayData = async () => {
//   const data = await fetchDataFromMongoDB();
//   console.log(data);
// };

// // Invoke the function to display data
// displayData();

////////////////////////////////////////
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
      "FIT.ADR": 1,
      "FIT.Revenue": 1,
      "Group.Rms": 1,
      "Group.ADR": 1,
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

// 특정 필드 데이터를 Date별로 출력하는 함수입니다.
const displaySpecificFieldsByDate = async () => {
  const data = await fetchSpecificFieldsByDate();
  data.forEach((item) => {
    console.log(
      `Date: ${item.Date}, Day: ${item.Day}, FIT ADR: ${item.FIT.ADR}, FIT Revenue: ${item.FIT.Revenue}, Group Rms: ${item.Group.Rms}, Group ADR: ${item.Group.ADR}`
    );
  });
};

// 함수를 호출하여 데이터를 출력합니다.
displaySpecificFieldsByDate();
