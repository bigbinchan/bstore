
var moogoose=require('mongoose');
var user=moogoose.model('User',require('../schemas/user'));
module.exports=user;