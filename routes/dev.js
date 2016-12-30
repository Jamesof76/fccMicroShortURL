var express = require('express');
var router = express.Router();

var shortid = require('shortid');

//var validUrl= require('valid-url');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//var mLab = 'mongodb://localhost:27017/urlshortenerdb';
var url = process.env.URLSHORTDB_URI;



/*mongoClient.connect(url, function (err, db) {
	if(err){
		console.log('Connection established to', url);
	}else{
		console.log('Connection established to', url);
		db.close();
	}
})*/

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get('/*', function(req, res, next){
	
	var theURL = req.params[0];
	var shortURL = "https://serene-woodland-24309.herokuapp.com/dev/" + shortid.generate();
	var asJSON = {"original_url": theURL, "short_url": shortURL};
	var dbTest = {"original_url": "www.example.com", "short_url": "www.examp.com"};
	
	
	MongoClient.connect(url, function (err, db) {
		if(err){
			console.log("Unable to connect to server", err);
		}else{
			console.log("Connected to server");
		}
		
		/*var myCursor = db.collection('collection').find({original_url: "www.example.com"});
		myCursor.toArray(function(err, doc){ res.json(doc[0]) } );*/
		
		if ( (theURL.includes("http://") || theURL.includes("https://") ) && theURL.includes(".") ) {
			var theCursor = db.collection('collection').find({original_url: theURL});
			//theCursor.toArray(function(err, doc){ res.send(doc) } );      // ---> []
			theCursor.toArray(function(err, doc){ 
				if( doc[0] == null ){
					db.collection('collection').insert(asJSON);
					res.json({"original_url": theURL, "short_url": shortURL});
					//res.send('true');
				}else{
					// retrieve json from db and res.send
					var reJSON = {"original_url": doc[0]["original_url"], "short_url": doc[0]["short_url"]};
					res.json(reJSON);
				}
			} );
			
			
		//}else if(!theURL.includes(".")){
		}else if(!/[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_]/.test(theURL) ) {
			// retrieve 'short_url' from db.
			// load corresponding original_url
			var nextShort = "https://serene-woodland-24309.herokuapp.com/dev/" + theURL;
			var theCursor = db.collection('collection').find({short_url: nextShort});
			theCursor.toArray( function(err,doc){
				var getURL = doc[0]["original_url"];
				res.redirect(getURL);
			} )
				
			
		}else{
			res.send("Please enter a valid web parameter.")
		}
		
		
		//res.json( myVar );
		
		//res.send(  );
		/*if ( db.collection('collection').find({original_url: "www.example.com"}).size() > 0 )   {
			//db.collection('collection').insert(asJSON);
			
			res.send( 'document in db' );
		}else{
			
			res.send( 'false' );
		}*/
		
		//db.collection('collection').insert(dbTest);
		//res.send('completed');
		
		
	});
	/*if ( (theURL.includes("http://") || theURL.includes("https://") ) && theURL.includes(".") ){
		//res.json(asJSON);
		
	}else{
		//res.send("Please enter a valid web address");
	}*/
		
		
		
		
	/*var theURL = req.params[0];
	var shortURL = "https://serene-woodland-24309.herokuapp.com/dev/" + shortid.generate();
	
	if ( (theURL.includes("http://") || theURL.includes("https://") ) && theURL.includes(".") ){
		var asJSON = {"original_url": theURL, "short_url": shortURL};
		res.json(asJSON);
	}else{
		res.send("Please enter a valid web address");
	}*/
	
	
} );

module.exports = router;
