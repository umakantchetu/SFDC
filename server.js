var express = require('express');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4')

var uuid1 = uuidv4()
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'INSERT INTO herokudemo.Contact (Phone, MobilePhone, FirstName, LastName, Email, External_Phone_ID__c) VALUES ($1, $2, $3, $4, $5,$6)',
                  [req.body.phone.trim(), req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim(), uuid1],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO herokudemo.Contact (Phone, MobilePhone, FirstName, LastName, Email, External_Phone_ID__c) VALUES ($1, $2, $3, $4, $5, $6)',
                  [req.body.phone.trim(), req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim(), uuid1],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
