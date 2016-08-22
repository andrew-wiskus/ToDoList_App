var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


router.put('/:id', function(req, res) {
    var id = req.params.id;
    var taskInfo = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in PUT, pg.connect", err, "\n \n \n \n");
            res.sendStatus(500);
        }

        if (taskInfo.task_priority === "") {
            taskInfo.task_priority = 0;
        }
        //To manage strings and refrences cleaner
        var queryString = 'UPDATE taskList SET task_name = $1, task_label = $2, task_priority = $3 WHERE id = $4';
        var refrenceValues = [taskInfo.task_name,taskInfo.task_label,taskInfo.task_priority, id];

        client.query(queryString, refrenceValues,

            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in PUT, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.sendStatus(200);

            });

    });

});

module.exports =router;
