
var mongoose = require('mongoose');
var bcrypt=require('bcryptjs');
var ObjectId=mongoose.Schema.Types.ObjectId;


var userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:String,
    role:{    //用于权限管理,0为未激活账户,大于100为网站管理员
        type:Number,
        default:-1
    },
    liked:[{type:ObjectId,ref:'Comment'}],
    email:String,
    order:[{type:ObjectId,ref:'Order'}],
    meta:{
        createAt:{
            type:Date,
            default:new Date()
        },
        updateAt:{
            type:Date,
            default:new Date()
        }
    },
    headpath:{
        type:String,
        default:'/images/userHeads/default.jpg'
    },
    favourites:[{type:ObjectId,ref:'Book'}],
   
});



userSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

userSchema.methods.comparePassword=function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatched){
        if(err) return cb(err);

        cb(null,isMatched);
    });
};

userSchema.index({expiretime:1},{expireAfterSeconds:259200}); //72小时不激活就删除

module.exports=userSchema;