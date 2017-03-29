var movie=require("../models/movie.js")
var comment=require("../models/comment")
var catetory=require("../models/catetory")

var _=require("underscore")
var fs=require('fs')
var path=require('path')



exports.savePoster=function(req,res,next){

	var data=req.files.uploadPoster
	// console.log('save'+data)
	var filePath=data.path
	var originalFilename=data.originalFilename
	if(originalFilename){
		console.log(originalFilename)
		fs.readFile(filePath,function(err,file){
			var timestamp=Date.now()
			var type=data.type.split('/')[1]
			var poster=timestamp+'.'+type
			var newPath=path.join(__dirname,'../../','/public/upload/'+poster)
			fs.writeFile(newPath,file,function(err){
				req.poster=poster
				next()
			})
		})
	}else{
		console.log('originalFilename')
		next()
	}
}
//admin post movie
exports.save=function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	console.log('req.poster:'+req.poster)
	if(req.poster){
		movieObj.poster=req.poster
	}
	if (id != 'undefined'&&id!=""&&id!=null) {
		console.log("defi")
		movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	} else {
		console.log("undefi")
		_movie = new movie(movieObj)
		var cat_id=movieObj.category
		var name=movieObj.catName
		_movie.save(function(err, movie) {
			if (err) {
				console.log('err')
				console.log(err)
			}
			if(cat_id){
				catetory.findById(cat_id,function(err,cate){
					cate.movies.push(movie._id)
					cate.save(function(err,cat){
						res.redirect('/movie/' + movie._id.toString())
					})
				})
				
			}
			else if(name){
				var cat=new catetory({
					name:name,
					movies:[movie._id]
				})
				cat.save(function(err,cat){
					movie.category=cat._id
					movie.save(function(err,movie){
						res.redirect('/movie/' + movie._id.toString())
					})
					
				})
			}
			
		})
	}
}
//admin update movie
exports.update= function(req, res) {
		var id = req.params.id
		console.log('now is update')
		if (id) {
			movie.findById(id, function(err, movie) {
				// console.log(movie)
				catetory.find({},function(err,categories){
					// console.log('categories'+categories)
					res.render('admin', {
						title: 'imooc 后台更新页',
						categories:categories,
						movie: movie
						
					})
				})
				
			})
		}
}


//detail page
exports.detail=function (req, res) {
	var id=req.params.id
	movie.update({_id:id},{$inc:{pv:1}},function(err){
		console.log(err)
	})
	movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}
		console.log("pv:"+movie.pv)
		comment
		.find({movie:id})
		.populate("from","name")
		.populate("reply.from reply.to","name")
		.exec(function(err,comments){
			
			// console.log(comments)
			res.render('detail', {
	        title: 'imooc 详情'+movie.title,
	        movie:movie,
	        comments:comments
		})
		
    })

	})
    
}
//admin page
exports.new=function (req, res) {
	catetory.find({},function(err,categories){
		res.render('admin', {
        title: 'imooc 后台录入页',
        categories:categories,
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
	})

}
//list delete
exports.del=function (req, res) {
  var id = req.query.id
  if (id) {
    movie.remove({
      _id: id
    }, function (err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
}

//list page
exports.list=function (req, res) {
	movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list', {
        title: 'imooc 首页',
        movies: movies
    })
	})
}