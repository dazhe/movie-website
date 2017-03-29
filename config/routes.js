var Movie=require("../app/controllers/movie")
var User=require("../app/controllers/user")
var Index=require("../app/controllers/index")
var Comment=require("../app/controllers/comment")
var Catetory=require("../app/controllers/catetory")

module.exports=function(app){
	//pre handle user
	app.use(function(req,res,next){
		var user=req.session.user
		app.locals.user=user
		next()
	})

	app.get('/',Index.index)
	//list user
	app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.list)
	app.get('/signin',User.showSignin)
	app.get('/signup',User.showSignup)
	app.post('/user/signup',User.signup)
	app.get('/logout',User.logout)
	app.post('/user/signin',User.signin)

	//admin update movie
	app.get('/admin/update/:id', User.signinRequired,User.adminRequired, Movie.update)
	app.post('/admin/movie/new', User.signinRequired,User.adminRequired,Movie.savePoster, Movie.save)
	app.get('/movie/:id', Movie.detail)
	app.get('/admin/movie', User.signinRequired,User.adminRequired, Movie.new)
	app.delete('/admin/movie/list', User.signinRequired,User.adminRequired, Movie.del)
	app.get('/admin/movie/list', User.signinRequired,User.adminRequired, Movie.list)

	//comment
	app.post('/user/comment', User.signinRequired, Comment.save)
	//catetory
	app.get('/admin/catetory/new', User.signinRequired,User.adminRequired, Catetory.new)
	app.post('/admin/catetory', User.signinRequired,User.adminRequired, Catetory.save)
	app.get('/admin/catetory/list', User.signinRequired,User.adminRequired, Catetory.list)

	//results
	app.get('/results',  Index.search)
}