var mongodb = require('mongodb').MongoClient;
var express = require('express');
var app = express();

var notValidUrlMessage= {"error":"Wrong url format, make sure you have a valid protocol and real site."};
var extRegEx = /\.(?=[a-z]{2})/;
var protRegEx =/http:\/\/|https:\/\//;

const mongoUrl = process.env.MONGOLAB_URI;

function randomizeUrl(length){
   var randomString = Math.random().toString(36).substr(2,length);
   return randomString;
}

function validUrl(url){
     if(url.match(extRegEx) && url.match(protRegEx)){
        // console.log("valid url found")
        return true;
    }else{
        return false;
    }

}
  
app.get("/*", function(req,res){
    
    var orgUrl = req.params['0'];
    var shortUrl = randomizeUrl(7);
    var sourceUrl = req.protocol + '://' + req.get('host') + '/'
    
    var output={
        "original_url": orgUrl,
        "short_url": shortUrl,
    }
    
    mongodb.connect(mongoUrl, function(err,db){
        if(err){
            console.log(err)
        }else{

            var urlCollection = db.collection("urls");

            urlCollection.findOne({short_url:{
                $eq:orgUrl}}, {original_url: true}, function(err,item){
                if(err){
                    console.log(err)
                }
                if(item){
     
                    res.redirect(item.original_url);
                    db.close();
                }else if(!validUrl(orgUrl)){
                    res.send(notValidUrlMessage)
    
                }else{
                   
                    var outputToSend = {
                        "original_url": orgUrl,
                        "short_url": sourceUrl + shortUrl,
                    };
                    urlCollection.insertOne(output);
                    db.close();
                   
                    res.send(outputToSend); 
                }
                    
                });
            
           
        }
        
    });
 
    
    
});

app.listen(process.env.PORT || 8080, function(){
  console.log('App listening on port ', process.env.PORT);
  
})