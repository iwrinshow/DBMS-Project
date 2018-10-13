var connection = require('./../db');
var express = require('express');

exports.login = function(req,res){
  var staff_id = req.body.username;
  var password = req.body.password;
  
  connection.query('SELECT * FROM staff WHERE staff_id = ?',[staff_id], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].staff_id == password){
        res.send({
          "code":200,
          "success":"login sucessfull"
            });
      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
}
