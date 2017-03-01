var mongodb = require('mongodb').MongoClient;
var express = require('express');
var app = express();

const mongoUrl = "mongodb://localhost:27017/urlshortener";


   function randomizeUrl(length){
       var randomString = Math.random().toString(36).substr(0,length);
       console.log(randomString);
       return randomString;
   }
   

app.get("/*", function(req,res){
    
    
    var baseUrl = req.params['0'];
    var shortUrl = randomizeUrl(7);
    

    //need to create a short url
        //generate random characters- 7?
        //verify db does not have 
    
    
    //then store the short url as key with a value of baseurl
    mongodb.connect(mongoUrl, function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log("Connected to the database at", mongoUrl)
            
            var collection = db.collection("urls");
            
            //if the short url exists then redirect the user
            if(collection.count(baseUrl)){
                //redirect the user
                
            }else{
                //else store the url in shorturl key value pair
                collection.insert({
                shortUrl: baseUrl
                })
            
            }
    
        }
        db.close();
    })
        
        
    
    
    
    
    //now send the response
    
    var output={
        "original_url": baseUrl,
        "short_url": shortUrl,
    }
    
    res.send(output);
    
});

app.listen(process.env.PORT || 8080, function(){
  console.log('App listening on port ', process.env.PORT)
  
})