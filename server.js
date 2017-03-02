var mongodb = require('mongodb').MongoClient;
var express = require('express');
var app = express();

// utility plugin
require('console.table')

const mongoUrl = "mongodb://localhost:27017/urlshortener";


function randomizeUrl(length){
   var randomString = Math.random().toString(36).substr(2,length);
   return randomString;
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

     
    
    //then store the short url as key with a value of baseurl
    mongodb.connect(mongoUrl, function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log("Connected to the database at", mongoUrl)
           
            var urlCollection = db.collection("urls");
               
            //check if db has passed url 
            
            var redirectUrl = urlCollection.findOne({short_url:{
                    $eq:baseUrl}}, {original_url: true}, function(err,item){
                        if(err){
                            console.log(err)
                        }
                        if(item){
                            console.log("redirect found")
                            console.log("item", item)
                            console.log("console log inside", item.original_url)
                            db.close();
                            res.redirect(item.original_url)
                            
                        }
                        //no record found add to db
                            console.log("Add to db")
                            urlCollection.insert(output)
                            db.close();
                            res.send(output);
                    })
            
            //returns a promise
            // console.log("Console log outside", redirectUrl)

            // if(redirectUrl === baseUrl){
            //     console.log("Redirect")
            //     ;

            //     //redirect the user
                
                
            // }else{
            //     console.log("add to collection")
            //     //else store the url in shorturl key value pair
            //     urlCollection.insert(output)
                
            //     db.close();
            //     res.send(output);
            // }

        }
        
    })
 
    
    
});

app.listen(process.env.PORT || 8080, function(){
  console.log('App listening on port ', process.env.PORT)
  
})