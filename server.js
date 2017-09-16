// save heroku URI
// MONGODB_URI: mongodb://heroku_5042z69r:b0335q5fpup4hrjahf743i7oij@ds119618.mlab.com:19618/heroku_5042z69r


var express = require("express"); // server
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose"); // for mongodb
var request = require("request"); // needed for scraping
var cheerio = require("cheerio"); // needed for scraping
// var exphbs = require('express-handlebars'); - not currently using handlebars
var Promise = require("bluebird");

var Note = require("./models/note.js");
var Movie = require("./models/news.js");

mongoose.Promise = Promise;

// initialize express
var app = express();

// morgan and body-parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// handlebars code, not using
// app.engine('handlebars', exphbs({
// 	defaultLayout: 'main'
// }));
// app.set('view engine', 'handlebars');

// make public a static dir
app.use(express.static("public"));

// database configuration with mongoose
mongoose.connect("mongodb://localhost/week-18-news-db");
var db = mongoose.connection;

// mongoose errors
db.on("error", function(error) {
    console.log("Mongoose error: ", error);
});

// log the connection with mongoose
db.once("open", function() {
  console.log("Mongoose connection working.");
});

// routes
app.get("/", function(req, res) {
  res.send(index.html);
});

// scrape the webpage and send to the database
app.get('/scrape', function(req, res){
    // request passes twp parameters, the URL and a callback
    request('http://www.ajc.com/', function(error, response, html){
        // use the cheerio library on the returned html which will give us jQuery functionality
        var $ = cheerio.load(html);
        // define the variables we're going to capture
        var title;
        var result = {};
        // use the header class as a starting point
        $('.title_block').filter(function(){
            // store the data in a variable
            var data = $(this);
            // assign the data to the result variable
            result = data.text();
        });

        // use the movie model to create a new database entry
        var entry = new News(result);
        // save the entry to the database
        entry.save(function(err, doc){
            //log any errors
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
            }
        });
    });
    res.send("scrape complete");
});

// get the movie info back from mongodb
app.get('/news', function(req, res){
    // grab all of the info from the movie
    News.find({}, function(error, doc){
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

// post a new note to the database
app.post('/news/note', function(req, res){
    // create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);
    // save the new note to the database
    newNote.save(function(error, doc){
        if (error) {
            console.log(error);
        }
        else {
            console.log(doc);
        }
    });
});

// grab a note from the database
app.get('/news/note', function(req, res){
    
});


// port connection
app.listen(8080, function() {
  console.log("App running on port 8080");
});
