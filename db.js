var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'iwrin',
	port     : '3306',
	password : 'password',
	database : 'wildlife_sanc'
});

connection.connect(function(err){
	if(!err) {
		console.log("Database is connected");
	} else {
		console.log("Error while connecting with database");
	}
});

module.exports = connection;