const { MongoClient } = require('mongodb');

// const uri = `mongodb+srv://${process.env.DB_UNAME}:${process.env.DB_PASSWORD}@cluster0.ycmnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = "mongodb+srv://sbk:secretsanta2021@cluster0.ycmnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(async (err) => {
  const collection = client.db("sample_mflix").collection("comments");
  // perform actions on the collection object
  const result = await collection.findOne({"name":"John Bishop"})
  console.log("connected", result);
//   client.close();
});



module.exports = client;