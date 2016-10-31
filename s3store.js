var fs=require('fs');
var path=require('path');
var request = require('request');
var util=require("util");
var config=require("./config/server-config.json");
var q = require('q');

logRequest=function(message,req,error,body){
	console.log(message+"{{{");
	console.log("url:"+req.url);
	console.log("headers:"+util.inspect(req.headers));
	console.log("method:"+req.method);
	console.log("query:"+util.inspect(req.query));
	console.log("query:");
	if(error){
		console.log("error:"+util.inpsect(error));		
	}
	if(body){
		console.log("body:",inspect(body));
	}
	console.log("}}}");
	
 };
	logResponse=function(message,error,response,body){
		console.log(message+"{{{");
		if(error){
			console.log("Error:"+util.inspect(error));
		}
		if(response){
			if(response){
				if(response.headers){
				  console.log("Header:"+util.inspect(response.headers));	
				}
				if(response.statusCode){
					  console.log("statusCode:"+response.statusCode);	
				}
			}
		}	
		if(body){
			console.log("body:",util.inspect(body));
		}
		console.log("}}}");	
	};


 
var s3store={				 		
		storejson: function(uuid, content, res){
		   if(typeof content === "object"){
				console.log(" object is received, parsing into the string");
				content=JSON.stringify(content);
			}
			console.log("writing to the file:"+uuid+"\n"+content);
			fs.writeFile(config.store.folder+"/"+config.store.prefix+uuid+config.store.suffix, content, function (err) {
			  if (err){
				  console.error(err);
				  console.log("completed the request:"+uuid)
					res.writeHead(500, {'Content-Type': "application/json" });	
				  res.end('{"error":"error"}');
				
			  }
			  else{
				    console.log("successfully writen:"+uuid);	
					console.log("completed the request:"+uuid)
					res.writeHead(200, {'Content-Type': "application/json" });	
					res.end(content);				
			  }
			});
				
		},
		getstoredjson: function(uuid, res){
			   
				console.log("reading the the file:"+uuid+"\n");
				fs.readFile(config.store.folder+"/"+config.store.prefix+uuid+config.store.suffix, "utf-8", function (err,data) {
				  if (err){
					  console.error("[****"+err+"****]");
					  console.log("completed the request:"+uuid)					  
						res.writeHead(404, {'Content-Type': "application/json" });	
					  res.end('{"error":"not found"}');					
				  }
				  else{
					  res.writeHead(200, {'Content-Type': "application/json" });
						res.end(data);				  
						console.log("successfully read for:"+uuid);  
				  }
						
						
				});
					
			},
	   checkapirequest:function(req,res, callback){
				console.log(" received post request:"+req.params.uuid);
				console.log(":::"+JSON.stringify(req.headers));
				
				var apikey = req.headers[config.apikey.header];
			    if(!apikey){
			    	apikey = req.headers[config.apikey.header.toLowerCase()];			    	
			    }
				if(!apikey){
					res.writeHead(500, {'Content-Type': "application/json" });	
					res.end('{"error":"apikey is required"}');
				}
				else if(apikey!=config.apikey.value){
					res.writeHead(500, {'Content-Type': "application/json" });	
					res.end('{"error":"wrong apikey"}');
				}
				else{
					callback();
				}
			},
			deletestoredjson: function(uuid, res){
				   
				console.log("deleting the the file:"+uuid+"\n");
				
				fs.unlink(config.store.folder+"/"+config.store.prefix+uuid+config.store.suffix);
			    res.writeHead(200, {'Content-Type': "application/json" });
			    res.end('{"success":"'+uuid+' is deleted"}');				  
					
					
			}
			

};

module.exports=s3store;
