var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var SALT_WORK_FACTOR=10

var userSchema=new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	pwd:String,
	//0 user
	//1 verified user
	//2 profession user
	//>10 super admin
	role:{
		type:Number,
		default:0
	},
    meta:{
    	createAt:{
    		type:Date,
    		default:Date.now()
    	},
    	updateAt:{
    		type:Date,
    		default:Date.now()
    	}
    }
})

userSchema.methods={
	comparePassword:function(_pwd,cb){
		bcrypt.compare(_pwd,this.pwd,function(err,isMatch){
			if(err){
				return cb(err)
			}
			cb(null,isMatch)
		})
	}
}


userSchema.pre('save',function(next){

	var user=this

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err)return next(err)
		bcrypt.hash(user.pwd,salt,function(err,hash){
			if(err)return next(err)
			user.pwd=hash
			next()
		})
	})
})

userSchema.statics={
	fetch:function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById:function(id,cb){
		return this.findOne({_id:id}).exec(cb)
	}
}

module.exports=userSchema