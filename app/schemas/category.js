
var mongoose = require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
    name:String,
    books:[{type:ObjectId,ref:'Book'}]
});


module.exports = CategorySchema;
