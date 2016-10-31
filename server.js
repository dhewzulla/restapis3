var http = require('http');
var util = require('util');
var express=require("express");
var path=require('path');
var request = require('request');
var s3store=require("./s3store.js");
var serverconfig=require("./config/server-config.json");
var q = require('q');
var app = express();
app.use(express.bodyParser());

app.post(serverconfig.path,function(req,res){	
	s3store.checkapirequest(req,res,function(){
		var methodoverride = req.headers['X-HTTP-Method-Override'];
		if(!methodoverride){
			methodoverride = req.headers['x-http-method-override'];
		}
		if(methodoverride && (methodoverride=="delete" || methodoverride=="DELETE")){
			s3store.deletestoredjson(req.params.uuid, res);			
		}
		else{
			s3store.storejson(req.params.uuid,req.body, res);
		}
		
		
	});
	
});
app.get(serverconfig.path,function(req,res){	
	console.log(" received get request:"+req.params.uuid);
	s3store.checkapirequest(req,res,function(){
		s3store.getstoredjson(req.params.uuid, res);
	});
});
   app.delete(serverconfig.path,function(req,res){	
	console.log(" received delete request:"+req.params.uuid);
	s3store.checkapirequest(req,res,function(){
		s3store.deletestoredjson(req.params.uuid, res);
	});
});

var server=app.listen(serverconfig.port,function(){	
	console.log("service is running on the: "+server.address().port);
});
	

