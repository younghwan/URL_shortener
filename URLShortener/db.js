const mysql = require('mysql');
const dbconfig = require('./config/database.js')
const connection = mysql.createConnection(dbconfig)
connection.connect();

var sql = 'select * from URL where origin_url = ?';
var params = 'https://www.naver.com/'

    connection.query(sql,params, function(error, rows, fields) {
        if (error) throw error;
        // var json = JSON.parse(rows[0])
        console.log('URL info is: ', rows[0]['origin_url']);
      });
      
connection.end();