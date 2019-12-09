const express = require('express');
const app = express();
var multer = require('multer');
var upload = multer();
const port = 3000;
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'armor_api_db'
});
var parts = ['torso', 'arms', 'legs', 'cape', 'helmet'];
var armor = ['armor'];

app.use(upload.array()); 
app.use(express.static('public'));

app.get('/api/:part/:id', function (req, res) {
    console.log('Id: '+req.params.id+' Part: '+req.params.part);
    connection.connect();
    if(parts.includes(req.params.part) == true){
        connection.query('SELECT * FROM '+req.params.part+' WHERE armor_Id = '+req.params.id, function (err, rows, fields) {
            if (err) throw err
            console.log('Mysql returns: ', rows)
            res.status(200).send(rows);
        });
    }else if(armor.includes(req.params.part) == true){
        var options = {sql: 'SELECT armor.armor_Id, helmet.name, helmet.color, helmet.defense,'
            +'torso.name, torso.color, torso.defense, '
            +'arms.name, arms.color, arms.defense, '
            +'legs.name, legs.color, legs.defense, '
            +'cape.name, cape.color, cape.defense '
            +'FROM armor as armor '
            +'INNER JOIN helmet ON armor.armor_Id = helmet.armor_Id '
            +'INNER JOIN torso ON armor.armor_Id = torso.armor_Id '
            +'INNER JOIN arms ON armor.armor_Id = arms.armor_Id '
            +'INNER JOIN legs ON armor.armor_Id = legs.armor_Id '
            +'INNER JOIN cape ON armor.armor_Id = cape.armor_Id '
            +'WHERE armor.armor_Id = '+req.params.id+' GROUP BY armor.armor_Id', nestTables: true};
        connection.query(options, function (err, rows, fields) {
            if (err) throw err
            console.log('Mysql returns: ', rows);
            res.status(200).send(rows);
        });
    }
    connection.end();
})
app.post('/api/:part/:id', function (req, res) {
    console.log('Id: '+req.params.id+' Part: '+req.params.part);
    console.log(req.body);
    var setQuery;
    for(entry in req.body){
        console.log(entry, ;
        ///if(entry.value != '' && entry.value != null) setQuery += 'SET '+entry.key+' = '+entry.value+' ';
    }
    //console.log(name, color, defense);
    connection.connect();
    // connection.query('UPDATE '+req.params.part+' '
    //     +''
    //     +' WHERE '+req.params.part+'.armor_Id = '+req.params.id, function (err, rows, fields) {
    //     if (err) throw err
    //     console.log('Mysql returns: ', rows)
    //     res.status(200).send(rows);
    // });
    connection.end();
})
app.put('/user', function (req, res) {
    res.status(200).send('Got a PUT request at /user')
})
app.delete('/user', function (req, res) {
    res.status(200).send('Got a DELETE request at /user')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));