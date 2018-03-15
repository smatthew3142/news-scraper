
var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({

	title: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},

	summary: {
		type: String,
	},

	comments: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

//Create Article Model
var Article = mongoose.model("Article", ArticleSchema);

//Export Article Model
module.exports = Article;










