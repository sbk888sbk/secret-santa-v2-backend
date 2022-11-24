const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser')
const router = require('./src/routes')
dotenv.config({path: './config.env'})

const db = require('././src/db/')



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(router)
const PORT = process.env.PORT;





app.get('/api', async (req, res, next) => {
   db.connect( async ()=> {

    const collection = db.db("sample_mflix").collection("santa")
    const result = await collection.find({"name":"examplename"}).toArray()
    // db.close();
    res.status(200).json(result)
  })

  
})

app.listen(PORT, async () => {
  db.connect( () => {
    console.log("Connected successfully")
    generateSysCodes()
  })
  
    console.log("listening on port", PORT)

})

function generateSysCodes(){
  db.connect( async () => {
    const collection = db.db("secret-santa").collection("users1");
    const users = await collection.find({}).toArray();
    users.forEach(async  (element) => {
      if(!element.sysCode){
        var randomNumber =  Math.floor(Math.random() * (999)) + 0;
        await collection.findOneAndUpdate({name : element.name}, {$set : {sysCode : randomNumber}})
      }
    })
})
}