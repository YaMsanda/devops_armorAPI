//Declaration of required libraries//
//Express is used for routing
const express = require('express');
const app = express();
const port = 3000;
//Pug is used for rendering views
const pug = require('pug');
//Path is used to simplify paths declaration in the project
let path = require('path');
//Multer is used to get the values of the parameters in the requests body
const multer = require('multer');
let upload = multer();
//Mysql is used to communicate with a Mysql database
const mysql = require('mysql');

//Mysql credentials
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'armor_api_db'
});

//Arrays used to test if a ":part" parameter is included in the parts or the armor
var parts = ['torso', 'arms', 'legs', 'cape', 'helmet'];
var armor = ['armor'];

//Using multer with express 
app.use(upload.array()); 
app.use(express.static('public'));

//Express route to get the view, we separated the API domain from the UI domain
app.get('/ihm', function(req, res){
    res.status(200).send(pug.renderFile(path.join(__dirname, 'views/home.pug')));
})

//API Part
//Express route to call a "SELECT" query on the database
app.get('/api/:part/:id', function (req, res) {
    
    //Testing if the ":part" is an armor or a part
    if(parts.includes(req.params.part) == true){
        connection.query('SELECT * FROM '+req.params.part+' WHERE armor_Id = '+req.params.id, function (err, rows, fields) {
            if (err){
                res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
            }
            res.status(200).send(JSON.stringify(rows));
        });
    //If ":part" is armor, we query all of the fields of all the parts of the armor
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
            res.status(200).send(JSON.stringify(rows));
        });
    }else{
        res.status(500).send(JSON.parse('{"500":{"Error":"'+req.params.part+' is not a valid armor part"}}'));
    }
    
})
//Express route to call a "UPDATE" query on the database
app.post('/api/:part/:id', function (req, res) {
    var setQuery ='';
    var setJSON = '';
    //For each part in the request's body, we need to add a section to the query
    //Here we are building a SQL query from the request's parameters
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
    
    connection.query('UPDATE '+req.params.part+' SET '+setQuery+' WHERE '+req.params.part+'.armor_Id = '+req.params.id, function (err, rows, fields) {
        if (err){
            res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
        }
        res.status(200).send(JSON.stringify(rows));
        // res.status(200).send(JSON.parse('{"'+req.params.part+'":['+setJSON+']}'));
    });
    
})

//Express route to call a "INSERT" query on the database
app.put('/api/:part/', function (req, res) {
    var setQueryFields ='(';
    var setQueryValues ='(';
    var setJSON = '';
    //For each part in the request's body, we need to add a section to the query
    //Here we are building a SQL query from the request's parameters
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
    
    connection.query('INSERT INTO '+req.params.part+' '+setQueryFields +' VALUES '+setQueryValues, function (err, rows, fields) {
        if (err){
            res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
        }
        res.status(200).send(returnJSON);
    });
    
})
//Express route to call a "DELETE" query on the database
app.delete('/api/:part/:id', function (req, res) {
    
        connection.query('DELETE FROM '+req.params.part+' WHERE armor_Id = '+req.params.id, function (err, rows, fields) {
            if (err){
                res.status(500).send(JSON.parse('{"500":{"Error":"'+err+'"}}'));
            }
            res.status(200).send(JSON.stringify(rows));
        });
    
})

app.listen(port, () => console.log(`App listening on port ${port}!`));