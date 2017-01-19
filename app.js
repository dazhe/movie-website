var express=require('express')
var path=require("path")
var _=require("underscore")
var mongoose=require("mongoose")
var movie=require("./models/movie.js")
var bodyParser = require('body-parser')
var port=process.env.PORT||3000
var app=express()
mongoose.connect('mongodb://localhost:27017/imooc')
app.set('views','./views/pages')
app.set('view engine','pug')
app.locals.moment=require("moment")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.listen(port)
console.log('now the engine is start!'+port)

//index page
// app.get('/',function(req,res){
// 	res.render('index',{
// 		title:'index'
// 	})
// })

//list page
// app.get('/admin/list',function(req,res){
// 	res.render('list',{
// 		title:'list'
// 	})
// })

//detail page
// app.get('/movie/:id',function(req,res){
// 	res.render('detail',{
// 		title:'detail'
// 	})
// })

//admin page
// app.get('/admin/movie',function(req,res){
// 	res.render('admin',{
// 		title:'admin'
// 	})
// })

//admin update movie
app.get('/admin/update/:id', function(req, res) {
		var id = req.params.id
		console.log(id)
		if (id) {
			movie.findById(id, function(err, movie) {
				console.log(movie)
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie
				})
			})
		}
})

//admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	console.log(movieObj)
	console.log("id=="+id)
	var _movie
	if (id !== 'undefined'&&id!==""&&id!==null) {
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
		_movie = new movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash


		})
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})
//index page    这里以及下面皆是路由以及赋值，这里的字段如title, poster等都会在相应的jade如index.jade中用到，实际上是将这里的值传入相应的jade以渲染页面
app.get('/', function (req, res) {
	movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index', {
        title: 'imooc 首页',
        movies: movies
    })
	})
    
})

//detail page
app.get('/movie/:id', function (req, res) {
	var id=req.params.id
	movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}
		res.render('detail', {
        title: 'imooc 详情'+movie.title,
        movie:movie
    })

	})
    
})
//admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
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
//list delete
app.delete('/admin/list', function (req, res) {
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
})

//list page
app.get('/admin/list', function (req, res) {
	movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list', {
        title: 'imooc 首页',
        movies: movies
    })
	})
})