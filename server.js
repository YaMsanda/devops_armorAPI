const express = require('express');
const app = express();
const pug = require('pug');
var path = require('path');
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

app.get('/', function(req, res){
    res.status(200).send(pug.renderFile(path.join(__dirname, 'views/home.pug')));
})

app.get('/api/:part/:id', function (req, res) {
    connection.connect();
    if(parts.includes(req.params.part) == true){
        connection.query('SELECT * FROM '+req.params.part+' WHERE armor_Id = '+req.params.id, function (err, rows, fields) {
            if (err){
                res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
            }
            res.status(200).send(JSON.parse('{"200":{"'+req.params.part+'":"'+req.params.id+'"}}'));
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
            if (err){
                res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
            }
            res.status(200).send(JSON.parse('{"200":{"'+req.params.part+'":"'+req.params.id+'"}}'));
        });
    }else{
        res.status(500).send(JSON.parse('{"500":{"Error":"'+req.params.part+' is not a valid armor part"}}'));
    }
    connection.end();
})
app.post('/api/:part/:id', function (req, res) {
    var setQuery ='';
    var setJSON = '';
    for(entry in req.body){
        if(req.body[entry] != '' && req.body[entry] != null){
            if(setQuery != '') setQuery+= ', ';
            if(setJSON != '') setJSON+= ', ';
            if(isNaN(req.body[entry]) == false){
                setQuery+= entry+' = '+req.body[entry];
                setJSON+= '{"field":"'+entry+'", "value":'+req.body[entry]+'}';
            }else{
                setQuery+= entry+' = \''+req.body[entry]+'\'';
                setJSON+= '{"field":"'+entry+'", "value":"'+req.body[entry]+'"}';
            }
        }
    }
    connection.connect();
    connection.query('UPDATE '+req.params.part+' SET '+setQuery+' WHERE '+req.params.part+'.armor_Id = '+req.params.id, function (err, rows, fields) {
        if (err){
            res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
        }
        res.status(200).send(JSON.parse('{"'+req.params.part+'":['+setJSON+']}'));
    });
    connection.end();
})
app.put('/api/:part/', function (req, res) {
    var setQueryFields ='(';
    var setQueryValues ='(';
    var setJSON = '';
    for(entry in req.body){
        if(req.body[entry] != '' && req.body[entry] != null){
            if(setQueryFields != '(') setQueryFields+= ', ';
            if(setQueryValues != '(') setQueryValues+= ', ';
            if(setJSON != '') setJSON+= ', ';
            if(isNaN(req.body[entry]) == false){
                setQueryFields+= '`'+entry+'`';
                setQueryValues+= req.body[entry];
                setJSON+= '{"field":"'+entry+'", "value":'+req.body[entry]+'}';
            }else{
                setQueryFields+= '`'+entry+'`';
                setQueryValues+= '\''+req.body[entry]+'\'';
                setJSON+= '{"field":"'+entry+'", "value":"'+req.body[entry]+'"}';
            }
        }
    }
    setQueryFields +=')';
    setQueryValues +=')';
    console.log(setQueryFields);
    console.log(setQueryValues);
    var returnJSON = '{"'+req.params.part+'":['+setJSON+']}';
    returnJSON = JSON.parse(returnJSON);
    connection.connect();
    connection.query('INSERT INTO '+req.params.part+' '+setQueryFields +' VALUES '+setQueryValues, function (err, rows, fields) {
        if (err){
            res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
        }
        res.status(200).send(returnJSON);
    });
    connection.end();
})
app.delete('/api/:part/:id', function (req, res) {
    connection.connect();
        connection.query('DELETE FROM '+req.params.part+' WHERE armor_Id = '+req.params.id, function (err, rows, fields) {
            if (err){
                res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
            }
            res.status(200).send(JSON.parse('{"'+req.params.part+'":"'+req.params.id+'"}'));
        });
    connection.end();
})

app.listen(port, () => console.log(`App listening on port ${port}!`));