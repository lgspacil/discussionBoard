var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/discussion_db');

var app = express();

var UserSchema = new mongoose.Schema({
	name: {type: String},
	_post: [{type: Schema.Types.ObjectId, ref:'Post'}],
	_comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
    _topics: [{type: Schema.Types.ObjectId, ref:'Topic'}]
}, {timestamps: true});

var TopicSchema = new mongoose.Schema({
	title: {type: String},
    description: {type: String},
	_user: {type: Schema.Types.ObjectId, ref:'User'},
    _post: [{type: Schema.Types.ObjectId, ref:'Post'}]
}, {timestamps: true});

var PostSchema = new mongoose.Schema({
	content: {type: String},
    likes: {type: Number},
    dislikes: {type: Number},
	_user: {type: Schema.Types.ObjectId, ref:'User'},
    _topic: {type: Schema.Types.ObjectId, ref:'Topic'},
    _comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
}, {timestamps: true});

var CommentSchema = new mongoose.Schema({
	content: {type: String},
	_user: {type: Schema.Types.ObjectId, ref:'User'},
    _post: {type: Schema.Types.ObjectId, ref:'Post'}
}, {timestamps: true});

mongoose.model('User', UserSchema);
mongoose.model('Topic', TopicSchema);
mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);

var User = mongoose.model('User');
var Topic = mongoose.model('Topic');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public/dist')));




app.post('/users', function(req, res){
	// console.log(req.body);
	var github = new GitHub(req.body);

	github.save(function(err){
		if(err){
			console.log("There was an error posting to the DB in the server.js!")
		}else{
			console.log("Success! posted to the DB");
		}
	})

	// return res.json(true);
})

app.get('/notes', function(req, res){
	
	GitHub.find({}, function(err, result){
		if(err){
			console.log("there was an error when trying to get data in the server.js");
		}else{
			return res.json(result);
		}
	})

})



app.listen(8000, function() {
    console.log("listening on port 8000");
})