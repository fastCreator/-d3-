var express = require('express');
var bodyParser = require('body-parser');
var path =require('path');

var mock =require('./lib/mock');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'chart')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/json',function(req,res,next){
    mock(req,res,'./data/chart.json');
});

app.listen(process.env.PORT || 8080);

