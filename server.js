// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

var exphbs = require("express-handlebars");

mongoose.Promise = Promise;
var PORT = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var routes = require("./controllers/controller.js");
app.use("/", routes);

// If deployed, use the deployed database. Otherwise use the local scrapeNews database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeNews";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

mongoose.connect("mongodb://127.0.0.1:27017/scrapeNews", {
  useMongoClient: true
});

var db = mongoose.connection;

app.listen(PORT, function() {
  console.log("App running on PORT " + PORT);
});