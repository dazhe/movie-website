var Comment=require("../models/comment.js")
var _=require("underscore")

//comment
exports.save=function(req, res) {
	var _comment = req.body.comment
	var moveId=_comment.movie
	console.log('_comment'+_comment.content)
	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply={
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.reply.push(reply)
			comment.save(function(err, comment) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + moveId)
			})
		})
	}else{
		var comment=new Comment(_comment)
		comment.save(function(err, comment) {
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/' + moveId)
		})
	}




	
}