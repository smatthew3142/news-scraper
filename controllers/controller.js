var express = require("express");

var router = express.Router();

var request = require("request");

var cheerio = require("cheerio");

var mongoose = require("mongoose");

mongoose.Promise = Promise;

var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.render("index");
});

// scrape new articles
router.post("/scrape", function(req, res) {
  request("http://www.npr.org/", function(error, response, html) {
    var $ = cheerio.load(html);
    var scrapedNew = {};
    $("article").each(function(i, element) {
      var result = {};

      result.title = $(element).find("h1").text().trim();
      result.link = $(element).find("a").attr("href");
      result.summary = $(element).find("p[class=teaser]").first().text().trim();

      if(result.title !== "" && result.link !== "" && result.summary !== ""){

        scrapedNew[i] = result;
      }

      else {
        console.log("article not saved");
      }

    });

    console.log(scrapedNew);

    var articleObj = {
        articles: scrapedNew
    };

    res.render("index", articleObj);

  });
});


//save article
router.post("/save", function(req, res) {
  
  var newArticleObject = {};
  newArticleObject.title = req.body.title;
  newArticleObject.link = req.body.link;
  newArticleObject.summary = req.body.summary;

  var entry = new Article(newArticleObject);
  console.log("Saved this artcile: " + entry);
  console.log(entry.summary);

  entry.save(function(err, doc) {
    //console.log(doc);
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
    }
  });
});


//  show saved articles
router.get("/saved", function(req, res) {
  
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      var articleObj = {
        articles: doc
      };
      //console.log(doc);
      res.render("saved", articleObj);
    }
  });
});


//remove from saved
router.get("/remove/:id", function(req, res) {
  Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {
    if (err) {
      console.log(err);
    } else {
      console.log("Article Removed");
    }
    res.redirect("/saved");
  });
});


// search by article id
router.get("/articles/:id", function(req, res) {
  Article.findOne({"_id": req.params.id})
  .populate('comments')

  .exec(function(err, doc) {
    if (err) {
      console.log("Can't find article");
    }
    else {
      res.json(doc);
    }
  });
});


// add a comment
router.post("/articles/:id", function(req, res) {
  var newComment = new Comment(req.body);
  
  newComment.save(function(error, doc) {
    if (error) {
      console.log(error);
    } 
    else { //update comment
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {comments: doc._id}}, {new: true, upsert: true})
      .populate('comments')
      .exec(function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.send(doc);
        }
      });
    }
  });
});

//delete comment
router.get("/comments/:id", function(req, res) {
  Comment.findOneAndRemove({"_id": req.params.id}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Comment");
    }
    res.send(doc);
  });
});

module.exports = router;