var mongoose=require('mongoose')
var catetorySchema=require('../schemas/catetory')
var catetory=mongoose.model('catetory',catetorySchema)

module.exports=catetory