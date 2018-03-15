
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

	body: {

		type: String,
		required: true
	}
});

//Create Comment Model
var Comment = mongoose.model("Comment", CommentSchema);

//Export Comment Model
module.exports = Comment;