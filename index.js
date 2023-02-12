const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'baza',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all subjects
app.get('/subjects', (req, res) => {
    mysqlConnection.query('SELECT * FROM subject', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an subjects
app.get('/subjects/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM subject WHERE SubID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an subjects
app.delete('/subjects/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Subject WHERE SubID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an subjects
app.post('/subjects', (req, res) => {
    let emp = req.body;
    console.log(req.body)
    var sql = "SET @SubId = ?;SET @Data = ?;SET @Answer = ?; \
    CALL SubjectAddOrEdit(@SubId,@Data,@Answer);";
    mysqlConnection.query(sql, [emp.SubId, emp.Data, emp.Answer], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send(element[0])
            });
        else
            console.log(err);
    })
});

//update an subjects
app.put('/subjects', (req, res) => {
    let emp = req.body;
    console.log(req.body)
    var sql = "SET @SubId = ?;SET @Data = ?;SET @Answer = ?; \
    CALL SubjectAddOrEdit(@SubId,@Data,@Answer);";
    mysqlConnection.query(sql, [emp.SubId, emp.Data, emp.Answer], (err, rows, fields) => {
        if (!err)
            res.send('UPDATED')
        else
            console.log(err);
    })
});

app.post('/login', (req, res) => {
    let emp = req.body;
    console.log(req.body)
    if(req.body.login == 'admin' && req.body.password == 'password'){
        res.send('GDFGBVCXM,BJK32423432')
    }
    res.send('INCORRECT LOGIN DATA')
});

app.post('/find', (req, res) => {
    let pattern = req.body.pattern;
    mysqlConnection.query('SELECT * FROM subject', (err, rows, fields) => {
        const results = rows.filter(obj => {
            return obj.Data.includes(pattern);
          });
          res.send(results);
    })
});
