var mongodb = require('mongodb').MongoClient;
var express = require('express');
var app = express();

var notValidUrlMessage= {"error":"Wrong url format, make sure you have a valid protocol and real site."}
var extRegEx = /\.(?=[a-z]{2})/;
var protRegEx =/http:\/\/|https:\/\//;

// utility plugin
require('console.table')

const mongoUrl = "mongodb://localhost:27017/urlshortener";



function randomizeUrl(length){
   var randomString = Math.random().toString(36).substr(2,length);
   return randomString;
}

function validUrl(url){
    //does it have an extension
    console.log("extension", url.match(extRegEx));
    console.log("protocol", url.match(protRegEx));
    if(url.match(extRegEx) && url.match(protRegEx)){
        console.log("valid url found")
        return true;
    }else{
        return false;
    }
    //does it have 
}
  
   

app.get("/*", function(req,res){
    
    var baseUrl = req.params['0'];
    var shortUrl = randomizeUrl(7);
    
    var output={
        "original_url": baseUrl,
        "short_url": shortUrl,
    }
    
    console.log("baseurl", baseUrl);
    console.log("shorturl", shortUrl);
    console.log("output outside", output)
     
    
  
    mongodb.connect(mongoUrl, function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log("Connected to the database at", mongoUrl)
           
            var urlCollection = db.collection("urls");
               
            //check if db has passed url 
            
            urlCollection.findOne({short_url:{
                $eq:baseUrl}}, {original_url: true}, function(err,item){
                    if(err){
                        console.log(err)
                    }
                    if(item){
                        console.log("redirect found");
                        console.log("item", item);
                        console.log("console log inside", item.original_url);
                        // var redirectUrl = urlFix(item.original_url);
                        res.redirect(item.original_url);
                        db.close();
                    }else if(!validUrl(baseUrl)){
                        res.send(notValidUrlMessage)
        
                    }else{
                        console.log("Add to db")
                        console.log("before insert", output)
                        urlCollection.insert(output);
                        db.close();
                        console.log("before send", output)
                        res.send(output); 
                    }
                    
                });
            
           
        }
        
    });
 
    
    
});

app.listen(process.env.PORT || 8080, function(){
  console.log('App listening on port ', process.env.PORT);
  
})