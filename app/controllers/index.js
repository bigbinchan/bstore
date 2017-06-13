
var Book = require('../models/book');
var Category=require('../models/category');
var Order=require('../models/order');
var _ =require('underscore');
var request=require('request');
var fs=require('fs');


//index page
exports.index=function (req, res){
   function newBooks(){
     return   new Promise(function(resolve,reject){
            Book.newb(function (err, books){      
                        resolve(books);
                        reject(err);
                });
        
       });
   } 
   
    function shopCar(){
     return   new Promise(function(resolve,reject){
            Order.findOne({user:req.session.user.id}).where({finished:false}).exec(function (err, order){
                       var valueId = [];
                       if(order){
                          for (var i = 0; i < order.books.length; i++) {
                            valueId.push(order.books[i]);
                         }
                     }
                     // else{
                     //        var order =new Order({
                     //            user:req.session.user.id
                     //        })

                     //     }
                          // console.log(valueId);
                          Book.find({_id:valueId}).exec(function(err,book){
                              // console.log(book);
                            // orderBook.push(book);
                             
                            resolve(book);

                        });
                       
                });
        
       });
   } 

    if(req.query.search){
        // console.log(req.query.search);
        var search = new RegExp(req.query.search);
        // Book.find({$text:{$search:req.query.search.split('').join(' ')}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).exec(function(err,result){
        Book.find({title:search}).exec(function(err,result){
        // console.log(result);

                newBooks().then(function(bookes){
                    res.render('index',{
                        title: 'Darkprince 首页',
                        resultbooks: result,
                        newbooks:bookes,
                order:req.session.orders
                    });
                    
                }).catch(function(err){
                    console.log(err);
                });
        });

        return;
    }

    req.query.time=='所有'&&(delete req.query.time);
    req.query.country=='所有'&&(delete req.query.country);
    req.query.type=='所有'&&(delete req.query.type);

    if(req.query.time||req.query.country||req.query.type){
        // console.log(1111);
        var booksGroup=[],  //初步结果集合
            middle=[],      //保险
            booksId=null,  //最终结果的Id
            books=[],   //最终结果
            syncGroupOne=[],     //获取各个分类的数据
            syncGroupTwo=[];     //获取整体数据


        for(let item in req.query)
            syncGroupOne.push(new Promise(function(resolve,reject) {   //得到每一类的电影id
                Category.findOne({name: req.query[item]}).exec(function (err, result) {

                    err && (console.log(err));
                    
                    result.books.forEach(function(ele,index){
                        result.books[index]=ele.toString();  //将objectId转为字符串
                    });

                    middle=middle.concat(result.books);
                    booksGroup.push(result.books);

                    resolve();
                });
            }));

        Promise.all(syncGroupOne)    //将js的异步操作转为同步
            .then(function(){
                return new Promise(function(resolve,reject){

                    booksId= _.intersection(booksGroup[0],booksGroup[1]||middle,booksGroup[2]||middle);  //取得交集

                    for(let item of booksId){
                        console.log(item);
                        syncGroupTwo.push(new Promise(function(resolve,reject){
                            Book.findOne({_id:item}).exec(function(err,result){
                                err&&(console.log(err));
                                if(result){
                                  books.push(result);
                                
                                }
                                resolve();
                            });
                        }));
                    }
                    resolve();
                });
            })
            .then(function(){
                return Promise.all(syncGroupTwo);    //得到整体数据
            })
            .then(function(){
                console.log(books);
                 newBooks().then(function(bookes){
                    res.render('index',{
                        title: 'Darkprince 首页',
                        resultbooks: books,
                        newbooks:bookes,
                order:req.session.orders
                    });
                    
                }).catch(function(err){
                    console.log(err);
                });
            });
    }
    else{
        Book.fetch(function (err, books) {
            err&&(console.log(err));
            if(req.session.user){
                // console.log(1111);
            shopCar().then(function(order){
         
                   newBooks().then(function(bookes){
                    req.session.orders = order;
                    // console.log(req.session);

                    res.render('index',{
                        title: 'Darkprince 首页',
                        resultbooks: books,
                        newbooks:bookes,
                    order:req.session.orders
                    });
                    
                });
           
                  
            });
        }
        else{
                  newBooks().then(function(bookes){

                    req.session.orders = "";
                    res.render('index',{
                        title: 'Darkprince 首页',
                        resultbooks: books,
                        newbooks:bookes,
                        order:req.session.orders
                    });
                    
                });
        }
        });

    };
}