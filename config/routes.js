//pre handle user
app.use(function(req,res,next){
	var user=req.session.user
	if(user){
		app.locals.user=user
	}
	return next()
})
//list user
app.get('/user/list', function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userList', {
        title: 'user 首页',
        users: users
    })
	})
})
//user signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user
	//req.param("user")
	

	User.find({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			res.redirect('/')
		}else{
			user=new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/user/list')
			})
		}
	})
})
//user logout
app.get('/logout',function(req,res){
	delete req.session.user
	delete app.locals.user
	res.redirect('/')
})


//user signin
app.post('/user/signin',function(req,res){
	var _user=req.body.user
	//req.param("user")
	var name=_user.name
	var pwd=_user.pwd

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/')
		}else{
			user.comparePassword(pwd,function(err,isMatch){
				if(err){
					console.log(err)
				}
				if(isMatch){
					req.session.user=user
					return res.redirect('/')
				}else{
					console.log('pwd is not matched!!!!!!!')
				}
			})
		}
	})

	
})




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
	console.log('user is in session')
	console.log(req.session.user)
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