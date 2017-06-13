/* 
* @Author: anchen
* @Date:   2017-05-15 11:50:52
* @Last Modified by:   anchen
* @Last Modified time: 2017-05-15 11:52:04
*/

var mongoose = require('mongoose');
var OrderSchema = require("../schemas/order");
var  Order= mongoose.model('Order',OrderSchema);

module.exports = Order;
