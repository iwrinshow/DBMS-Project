var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();


var login = require('./routes/login');


const port = 3000;

app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'Public')));

app.post('/login', login.login);

app.get('/', (req, res)=>{
	res.send('foobar');
});

app.listen(port, ()=>{
	console.log('Server started at port:'+port);
});