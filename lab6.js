let mongodb = require('mongodb');
let mongoDBClient = mongodb.MongoClient;
let bodyparser = require('body-parser');

let express = require('express');
let morgan = require('morgan');
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));

app.use(express.static("images"));
app.use(express.static("styles"));

let db = null;
let col = null;
let url = "mongodb://localhost:27017";
mongoDBClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {

    db = client.db("week6lab");
    col = db.collection("tasks");

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/addtask.html");
});

app.post('/addtask', function (req, res) {
    console.log(req.body);
    col.insertOne(req.body,function(err,success){
        if(!err){
            col.find({}).toArray(function(err,data){
                if(!err){
                    res.render('alltasks', {task: data});
                }
            })
        }
    })
});

app.get('/alltasks', function (req, res) {
    col.find({}).toArray(function (err, data) {
        res.render('alltasks', {task: data});
    });
});

app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updatetask.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskInfo = req.body;
    let filter = { _id: mongodb.ObjectId(taskInfo.taskId) };
    let theUpdate = { $set: { taskStatus: taskInfo.taskNewStatus } };

    col.update(filter, theUpdate);
    
    res.redirect('/alltasks');// redirect the client to all tasks
})

app.get('/deletetaskbyid', function (req, res) {
    res.sendFile(__dirname + '/views/deletetaskbyid.html');
});


app.post('/deletetaskiddata', function (req, res) {
    let taskInfo = req.body;
    let filter = { _id: mongodb.ObjectId(taskInfo.taskId) };
    col.deleteOne(filter);
    res.redirect('/alltasks');// redirect the client to all tasks
});


app.get('/deletetaskbystatus', function (req, res) {
    let query = { taskStatus: "Complete" };
    col.deleteMany(query, function (err, obj) {
        res.redirect('/alltasks');
    })

})

app.listen(8080);