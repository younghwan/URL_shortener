/* app.js */
const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyParser = require('body-parser');

const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const { urlencoded, request } = require('express');
const connection = mysql.createConnection(dbconfig)
connection.connect();

app.set("view engine","ejs");
app.use(express.static(__dirname+'/'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.render("home",{});
})

app.get("/re/:url",function(req,res){

    var sql = 'SELECT * FROM url WHERE shorten_url = ?';
    var params =  '/re/'+req.params.url
    
    var origin_url = ''
    connection.query(sql,params, function(error, rows, fields) {
        if (error) throw error
    
        origin_url = rows[0]['origin_url'];
     
        res.redirect(origin_url)
      });
})


app.post("/check",function(req,res){
    
    var params =  req.body['input']

    if(!checkUrlForm(params)){
        res.send('잘못된 URL')
        return
    }

    var sql = 'SELECT shorten_url FROM url WHERE origin_url = ?';

    connection.query(sql,params, function(error, rows, fields) {
        if (error){
            console.log("error : "+error)
        }

        if(rows[0] == null){
            console.log("ss?")
            var result = '/re/'+base62_encode(2390687438976,req.body['input']);

            var sql = 'INSERT INTO url (origin_url,shorten_url) VALUES(?,?)';
            var params = [req.body['input'],result]

            connection.query(sql,params,function(err,rows,fields) {
                if(err){
                    console.log("di"+err)
                }else{
                    console.log(rows.insertId)
                }
            })
            res.send(result);
        }else{
            res.send(rows[0]['shorten_url']);
        }
      });
})

app.listen(3000,function(){
    console.log("running");
})

var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function base62_encode(n, alpha) {
  var num = n || 0;
  var alphabet = alpha || ALPHABET;

  if (num == 0) return alphabet[0];
  var arr = [];
  var base = alphabet.length;

  while(num) {
    rem = num % base;
    num = (num - rem)/base;
    char = alphabet.substring(rem,rem+1)
    if(char != '/' && char != ':'){
      arr.push(char); 
    }
  }

  return arr.reverse().join('');
}

function checkUrlForm(strUrl) {
    var expUrl = /^http[s]?\:\/\//i;
    return expUrl.test(strUrl);
}