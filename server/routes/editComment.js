var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.put('/:id', function(req, res) {
    var id = req.params.id;
    var taskStatus = req.body.comment;
    
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in PUT, pg.connect", err, "\n \n \n \n");
            res.sendStatus(500);
        }

        //To manage strings and refrences cleaner
        var queryString = 'UPDATE taskList SET task_description = $1 WHERE id = $2';
        var refrenceValues = [taskStatus, id];

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



module.exports = router;
