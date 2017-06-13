

var mongoose = require('mongoose');
    ObjectId=mongoose.Schema.Types.ObjectId;

var OrderSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:'User'
    },
     books:[{type:ObjectId,ref:'Book'}],
     finished:{
        type:Boolean,
        default:0
    },
    fahuo:{
        type:Boolean,
        default:0
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
     total:{
        type:Number,
        default:0
    }
});
// BookSchema.pre("save",function(next){
    
//         this.createAt =Date.now();
//     next();
// })

module.exports = OrderSchema;