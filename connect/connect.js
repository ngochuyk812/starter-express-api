var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
    host: process.env.HOSTSQL,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!!!")
  });


  module.exports = con;
