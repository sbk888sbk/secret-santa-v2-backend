const express = require('express');
const router =  express.Router();
const db = require('../db')

const CryptoJS = require("crypto-js");

const secretKey = "HappySecretSanta2021"




router
    .route(['/list', '/list/:pass'])
    .get( (req, res, next) => {
        console.log(req.params)
        db.connect( async () => {
            const collection = db.db("secret-santa").collection("users1");
            let  result = await collection.find({}).toArray()
            result.forEach(ele => ele.child = '')
            if(req.params.pass === 'admin') {
                //new change
                result.forEach( santa => {
                    santa.sysCode = CryptoJS.AES.encrypt(`${santa}`, secretKey).toString();
                })
                return  res.status(200).json({ result: result });
            }
            result = result.map((user)=> user = {name: user.name})
            return res.status(200).json({ result: result });
        })
    })
    .post( (req, res, next) => {
        db.connect( async () => {
            const collection = db.db("secret-santa").collection("users1");
            const payload = [...req.body.users];
            const result = await collection.insertMany(payload)
            console.log(result)
            res.status(200).json({message: "Insert successful"})
        })
    })

    router
    .route(['/generateChild'])
    .post( async (req, res, next) => {
        let name = req.body.name.toString();
        let sysCode = req.body.sysCode.toString();
        if(!req.body.sysCode) return res.status(401).json({message: "SysCode not present"})

        const collection = db.db("secret-santa").collection("users1");
        const userArr = await collection.find({"name":name, "sysCode":Number(sysCode)}).toArray();
        const user = userArr[0]


        // if(user.child) return res.status(200).json({"child": simpleCrypto(user.child)})
        const users = await collection.find({}).toArray()
        let childName;
        var encryptedChildName;
        if(user.chid) encryptedChildName =user.child;
        while(!user.child){
            let randomNumber = Math.floor(Math.random() * users.length)
            childName = users[randomNumber].name;
            if( childName!== user.name
                 && !users[randomNumber].isChosen
                 && (users[randomNumber].previousChild?
                users[randomNumber].previousChild !== childName : true)
                ){
                encryptedChildName = CryptoJS.AES.encrypt(`${childName}`, secretKey).toString();
                let result = await collection.findOneAndUpdate({name: user.name}, {$set: {child: encryptedChildName}})
                result = await collection.findOneAndUpdate({name: childName}, {$set : {isChosen: true}}) 
                user['child'] = childName;
                break;
            }
        }
        encryptedChildName = user.child
        // // Encrypt
        res.status(200).json({"child": encryptedChildName})
    })

module.exports = router;