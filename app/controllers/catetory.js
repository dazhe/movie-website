var catetory=require("../models/catetory")
var _=require("underscore")

//admin update movie
exports.save=function(req, res) {
	var _cat = req.body.cat
	
	var cat=new catetory(_cat)
	cat.save(function(err, cat) {
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/catetory/list')
	})
}

exports.list=function (req, res) {
	catetory.fetch(function(err,cats){
		if(err){
			console.log(err)
		}
		res.render('catlist', {
        title: 'cat list',
        cats: cats
    })
	})
}
//admin page
exports.new=function (req, res) {
    res.render('cat_admin', {
        title: 'imooc dianyingfenlei录入页',
        cat: {
            name: ''
        }
    })
}