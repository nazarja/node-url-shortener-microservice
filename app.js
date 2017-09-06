// Require Modules
var express = require('express');
var app = express();
var valid = require('url-valid');
var mongo = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/url-shortener";
var base64 = require('./base64.js');
var port = process.env.PORT || 3000;

// Vaiables and urls
var staticFiles = __dirname + '/public/';
var indexHTML = __dirname + '/views/index.html';
var baseURL = "http://localhost:3000/"
var encodedURL = "";
var decodedURL = "";
var id;
// Create object for response
var obj = {};

// Random Number Function -betwwen 10k and 1m
function randomNumber() {
    id = (Math.floor(Math.random() * 990000) - 1) + 10000;
}

// Serve up static files
app.use(express.static(staticFiles));

// Route to serve up the homepage
app.get('/', function(req, res) {
    res.sendFile(indexHTML);
});

// Route to create and shorten a given url
app.get('/new/:url(*)', function(req, res) {
    var originalURL = req.params.url;
    
    // Validate the URL before procedding any further
    valid(originalURL).on('check', function (err, valid) {
        if (err) throw err;

        if (valid) {

                // Create random Number
                randomNumber();

                // Connect to Mongo
                mongo.connect(mongoURL, function(err, db) {
                    if (err) throw err;

                    var collection = db.collection('urls');

                    // insert id into collection
                    collection.insertOne({
                        id: id,
                        url: originalURL
                    }, function(err, result) {
                        if (err) throw err;
                        db.close();
                    });
                });
       
            // Encode the url and create an object and links to return
            encodedURL = baseURL + base64.encode(id);
            obj['Original URL'] = originalURL;
            obj['Shortened URL'] = encodedURL;
            
            // Send Response back as a JSON Object
            return res.json(obj);
        }
        else {
            obj['Error'] = "Please make sure you have entered a valid URL.";
            obj['Try Again'] = "http://localhost:3000";
            // Break and return immediatly with error Object
            return res.json(obj);
        }

    });
});

// Route to decode and redirect from a shortened url
app.get('/:urlEncoded', function(req, res) {

    encodedURL = req.params.urlEncoded;
    if (encodedURL.includes('favicon') || encodedURL.includes('/new/')) {
        return false;
    }
    // Decode the URL back to an id
    id  = base64.decode(encodedURL);
    // Check database for that id and linked url
    mongo.connect(mongoURL, function(err, db) {
        if (err) throw err;

        db.collection("urls").find({id}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.redirect(result[0].url);
            db.close();
        });
    });
});

var server = app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});
