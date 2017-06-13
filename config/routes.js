/**
 * Created by Administrator on 2016/11/29.
 */
var index = require('../app/controllers/index');
var book = require('../app/controllers/book');
var user = require('../app/controllers/user');
var order = require('../app/controllers/order');
var comment = require('../app/controllers/comment');
var User=require('../app/models/user.js');
var fs=require('fs');
var moment=require('moment');

//pre handle
module.exports=function(app) {
    app.locals.moment=moment;
    app.use(function (req, res, next) {  //预处理

        if(req.session.user)

            User.findOne({_id:req.session.user._id}).exec(function (err, result) {
                req.session.user = result;
                app.locals.user = req.session.user;
                next();
            });
         else {
            next();
            app.locals.user=null;
        }

    });

//index page
    app.get('/', index.index);

//Bookdetail page
    app.get('/book/:id', book.bookDetail);
//Books list page
    app.get('/admin/list',user.authorityRequired, book.bookList);
//admin page
    app.get('/admin/book',user.authorityRequired,book.addBook);
//admin post book
    app.post('/admin/book/new', book.savePoster,book.addBookP);
    app.get('/book/change/:id',book.change);
    app.post('/book/change/new/:id', book.savePoster,book.changeP);   
    // app.post('/admin/book/new', user.authorityRequired, book.addBookP);
//delete
    app.delete('/admin/list/delete',user.authorityRequired, book.deleteBook);
//验证豆瓣id和书籍名称
    app.get('/admin/verify',book.verify);

//userList
    app.get('/admin/userlist',user.authorityRequired,user.userList);
//delete
    app.delete('/admin/user/delete',user.authorityRequired,user.deleteUser);
    app.get('/admin/user/check',user.authorityRequired,user.checkUser);
//sign up page
    app.post('/user/signup', user.signup);
//sign in page
    app.post('/user/signin', user.signin);
//注册验证账户
    app.get('/verify', user.verify);
//退出登录状态
    app.get('/logout', user.logout);
//拒绝访问
    app.get('/refused',user.refused);
//激活账户
    app.get('/user/activateAccount/:id',user.activateAccount);
//添加收藏
    app.get('/user/addFavourites',user.addFavourites);
//删除收藏
    app.get('/user/deleteFavourite',user.deleteFavourite);
//添加订单
     app.get('/user/addOrder',order.addbook);

     app.delete('/shopcar/list/delete',order.delCar);

     app.get('/pay',order.pay);

    app.get('/admin/orderList',user.authorityRequired,order.orderList);
    app.get('/oreder/fahuo/:id',order.fahuo);

//上传预览图片
    app.post('/user/updateHead',user.updateHead);
//获取验证码
    app.get('/user/captcha',user.getCaptcha);
//个人空间
    app.get('/user/:id',user.userSpace);


    //comment.js
    app.post('/comment/save',comment.addComment);
    //Likes
    app.get('/comment/like',comment.like);
    //postSubComment
    app.get('/comment/subcommentsave',comment.addSubComment);
    //getSubComments
    app.get('/comment/getSubComments',comment.getSubComments);
    //获取头像
    app.get('/comment/getHead',comment.getHead)
};


