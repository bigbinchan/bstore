
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
var BookSchema = new mongoose.Schema({
    auther:String,
    title:{
        type:String,
        unique:true
    },
    country:String,
    summary:String,   
    price:Number,
    poster:String,
    year:String,
    createAt:{
        type:Date,
        default:new Date()
        },
    category:[String]  
});
BookSchema.pre("save",function(next){
    
        this.createAt =Date.now();
    next();
})


BookSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort({_id: -1})
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    },
    newb:function(cb){
        return this
            .find({})
            .sort({_id: -1})
            .limit(12)
            .exec(cb);
    }
};

BookSchema.index({title:'text'});

module.exports = BookSchema;