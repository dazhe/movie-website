var movie=require("../models/movie.js")
var catetory=require("../models/catetory.js")


exports.search=function (req, res) {
	var cat=req.query.cat
	var q=req.query.q
	var page=parseInt(req.query.p, 10) || 0
	var count=2
	var index=page*count

	if(cat){
		catetory
		.find({_id:cat})
		.populate({path:'movies',select:'title poster'})
		.exec(function(err,cats){
			if(err){
				console.log(err)
			}
			var catgory=cats[0]||{}
			var movies=catgory.movies||[]
			var results=movies.slice(index,index+count)
			res.render('results', {
		        title: 'imooc 结果列表页面',
		        currentPage:(page+1),
		        query:'cat='+cat,
		        totalPage:Math.ceil(movies.length/count),
		        keyword:catgory.name,
		        movies: results
	    	})
		})
	}else{
		movie
		.find({title: new RegExp(q + '.*', 'i')})
		.exec(function(err,movies){
			if(err){
				console.log(err)
			}
			var results=movies.slice(index,index+count)
			console.log('q:'+q)
			console.log('search:'+results)
			res.render('results', {
		        title: 'imooc 结果列表页面',
		        currentPage:(page+1),
		        query:'q='+cat,
		        totalPage:Math.ceil(movies.length/count),
		        keyword:q,
		        movies: results
	    	})
		})
	}
	
	
}
//index page    这里以及下面皆是路由以及赋值，这里的字段如title, poster等都会在相应的jade如index.jade中用到，实际上是将这里的值传入相应的jade以渲染页面
exports.index=function (req, res) {
	catetory
	.find({})
	.populate({path:'movies',options:{limit:5}})
	.exec(function(err,cats){
		if(err){
			console.log(err)
		}
		res.render('index', {
	        title: 'imooc 首页',
	        cats: cats
    	})


	})
	
}
