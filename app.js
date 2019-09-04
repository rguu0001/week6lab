
// 1- get a reference to MongoDB module ref
let mongodb = require('mongodb');
// 2- from ref get the client
let mongoDBClient = mongodb.MongoClient;
let bodyParter = require('body-parser');
// 3- from the client get the db
let express=require('express');
let app=express();

app.use(bodyParter.urlencoded({extended: false}));

let db = null;
let col = null;
let url = "mongodb://localhost:27017/";


mongoDBClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){

    db = client.db("week5lec"); // database name
    col = db.collection("users");
});

app.get('/',function(req,res){
    res.sendFile(__dirname+"/views/index.html")
    col.insertOne({fullName:'John',salary:4500});
    // res.send("Thank you");
});

app.post('/newdocument', function(req,res){
    let newDoc={name:req.body.fullName,age:parseInt(req.body.age)};
    console.log(req.body);
    col.insertOne(req.body);
    res.send("Thank you");
});

app.get('/getAll',function(req,res){
    let query={};
    let sort={age:-1}; // 1 for in, -1 for de
    col.find(query).toArray(function(err,data){
        res.send(data);
    })
});

app.get('/deleteName/:nameToDelete',function(req,res){
    let nameDel=req.params.nameToDelete;
    let query={name:nameDel};
    col.deleteOne(query,function(req,res){

    })
});

// 1<=age<57 $and $or
// {$and:[{age:{$gte:1}},{age:{$lt:57}}]}

app.get('/getAllN',function(req,res){
    // let query={name:/^N/};
    let query={age:{$lt:30}};
    col.find(query).toArray(function(err,data){
        res.send(data);
    })
});

app.get('/addAge/:newAge',function(req,res){
    let theNewAge=parseInt(req.params.newAge);
    let query={};
    let theUpdate={$inc:{age:theNewAge}};
    col.uodateMany(query,theUpdate,{ upsert: true }, function(err,obj){
        col.find({}).toArray(function(err,data){
            res.send(data);
        })
    })
})

app.listen(8080);
// 4- from the db get the collection
// 5- using the col, perform insert, delete, update, find CRUD operations
