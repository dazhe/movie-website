var express=require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var session = require('express-session')
var mongoStore=require('connect-mongo')(session)
var path=require("path")
var fs = require('fs')
var mongoose=require("mongoose")
var morgan = require('morgan')


var dbURL='mongodb://localhost:27017/imooc'

var bodyParser = require('body-parser')
var port=process.env.PORT||3000
var app=express()


// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)



app.use(cookieParser())
app.use(require('connect-multiparty')())
app.use(session({
	secret:'imooc',
	maxAge: 24 * 60 * 60 * 1000 ,// 24 hours
	store:new mongoStore({
		url:dbURL,
		collection:'sessions'
	})
}))

mongoose.connect(dbURL)
app.set('views','./app/views/pages')
app.set('view engine','pug')
app.locals.moment=require("moment")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))

if('development'===app.get('env')){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty=true
	mongoose.set('debug',true)
}

require('./config/routes')(app)
app.listen(port)
console.log('now the engine is start!'+port)