var User=require("../models/user.js")

//mindware for user
exports.signinRequired=function(req,res,next){
	var user=req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
exports.adminRequired=function(req,res,next){
	var user=req.session.user
	if(user.role<=10){
		return res.redirect('/signin')
	}
	next()
}

//showSignin
exports.showSignin=function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('signin', {
        title: 'showSignin page',
    })
	})
}
//showSignup
exports.showSignup=function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('signup', {
        title: 'showSignup page',
    })
	})
}
//list user
exports.list=function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userList', {
        title: 'user 首页',
        users: users
    })
	})
}
//user signup
exports.signup=function(req,res){
	var _user=req.body.user
	//req.param("user")
	

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			res.redirect('/signin')
		}else{
			user=new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})
}
//user logout
exports.logout=function(req,res){
	delete req.session.user
	//delete app.locals.user
	res.redirect('/')
}


//user signin
exports.signin=function(req,res){
	var _user=req.body.user
	//req.param("user")
	var name=_user.name
	var pwd=_user.pwd

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/signup')
		}else{
			user.comparePassword(pwd,function(err,isMatch){
				if(err){
					console.log(err)
				}
				if(isMatch){
					req.session.user=user
					return res.redirect('/')
				}else{
					return res.redirect('/signin')
					console.log('pwd is not matched!!!!!!!')
				}
			})
		}
	})	
}