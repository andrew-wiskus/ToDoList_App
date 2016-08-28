//Build Template

//TODO: run this in postgres
// CREATE TABLE testbase (
//     id SERIAL PRIMARY KEY,
//     item_name character varying(255),
//     item_amount integer
// );

//TODO: change json title, desc, etc.
//TODO: npm install dependencies
//TODO: check /routes/testRoute.js for additional settup



var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(bodyParser.json());



//modules
var testModule = require("./modules/testModule.js");
console.log(testModule.test("\n\n\n\napp.js: testing module connection"));



//routes
var editComment = require("./routes/editComment.js");
app.use('/editComment', editComment);

var todoList = require("./routes/todoList.js");
app.use('/todoList', todoList);

var editList = require("./routes/editList.js");
app.use('/editList', editList);

var editTask = require("./routes/editTask.js");
app.use('/editTask', editTask);






app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('server is running on port', app.get('port'));

});
