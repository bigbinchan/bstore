/* 
 * @Author: anchen
 * @Date:   2017-05-15 11:53:42
 * @Last Modified by:   anchen
 * @Last Modified time: 2017-06-02 23:49:25
 */
var Book = require('../models/book');
var User = require('../models/user');
var Order = require('../models/order');
exports.addbook = function(req, res) {
        // var user = res.session.user;
       var title = req.query.title;
        Book.findOne({title:title}).exec(function(err, book) {
                    // console.log(req.query.title);
                    console.log(book);
                    if (err) console.log(err);
                    User.findOne({_id: req.session.user._id}).exec(function(err, user) {

                        if (user.order){

                            Order.findOne({
                                user:req.session.user._id
                            }).where({finished:false}).exec(function(err, order) {
                                console.log(order);
                                if(order) {
                                    order.books.push(book._id);
                                    // order.total=parseInt(book._price)+parseInt(order.total); 
                                    order.save(function(err) {
                                        console.log("保存 了");
                                        if (err) {
                                            console.log(err);
                                        }
                                        req.session.orders.push(book._id);
                                res.json({
                                    status:"200",
                                    data:book
                                })
                                    })
                                } else{
                                    var order = new Order({
                                        user: user
                                    });
                                    order.books.push(book._id);
                                    // order.total +=books.price; 
                                    order.save(function(err) {
                                        console.log("他保存 了");

                                        if (err) {
                                            console.log(err);
                                        }
                                        user.order.push(order._id);
                                        // req.session.orders.push(book._id);
                                res.json({
                                    status:"200",
                                    data:book
                                })
                                    });
                                }
                            });
                        // } else {
                        //     var order = new Order({
                        //         user: user
                        //     });
                        //     order.books.push(book._id);
                        //     // order.total +=books.price; 
                        //     order.save(function(err) {
                        //         if (err) {
                        //             console.log(err);
                        //         }
                        //         user.order.push(order._id);
                        //         req.session.orders.push(book._id);
                        //         res.json({
                        //             status:"200",
                        //             data:book
                        //         })
                        //     });
                        // }
                    }
                });
});
}
Array.prototype.remove = function(id){
            console.log(111);

    for(var i=0,n=0;i<this.length;i++)
        {
        if(this[i]==id)
        {
            this.splice(i,1);
        }
        }
}
exports.delCar = function(req,res){
     var id = req.query.id;
     var user = req.session.user._id;
      Order.findOne({user:user}).where({finished:false}).exec(function(err,order){
            if(err) console.log(err);

                    order.books.remove(id); 

                     order.save(function(err){
                        if(err) console.log(err);
                        Book.findOne({_id:id}).exec(function(err,book){
                            console.log(book)
                        res.json({
                        data:book,
                        status:"3"
                        });
                        });                           
                     });
                    
                    
            });            
          }
exports.orderList = function(req,res){
    Order.find().where({finished:true}).populate('user books','name title auther -_id').sort({_id: -1}).exec(function(err,orders){
        // console.log(orders[0].books[0].title)
        res.render("orderlist",{
            title:'订单列表',
            orders:orders,
            order:req.session.orders
        });
    });
} 
exports.pay = function(req,res){
    Order.findOne({user:req.session.user.id}).where({finished:false}).exec(function(err,order){
        console.log(order);
       
            console.log(order.books.length);
             order.finished = true;
        order.save(function(err,result){
            
            if(err) console.log(err);
            req.session.orders = result;
            
        })
        
        res.redirect('/' );
       
    })
}
exports.fahuo = function(req,res){
    var id = req.params.id;
    Order.findOne({_id:id}).exec(function(err,result){
        err&&console.log(err);
        if(result){
            result.fahuo = true;
            result.save(function(err){
                err&&console.log(err);
                res.redirect('/admin/orderList' );
            });
        }
    });
}