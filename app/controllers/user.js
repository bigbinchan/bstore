
var User = require('../models/user'),
    nodemailer=require('nodemailer'),
    Book=require('../models/book'),
    Order=require('../models/order'),
    Comment=require('../models/comment'),
    Form=require('formidable'),
    path=require('path'),
    fs=require('fs'),
    request=require('request'),
    bcrypt=require('bcryptjs'),
    SALT_WORK_FACTOR=10;



//sign up page
exports.signup=function (req, res) {
    var user = req.body.user;

    User.findOne({name:user.name}).exec(function(err,result){
        if(result) user=false;
    });

    User.findOne({email:user.email}).exec(function(err,result){
        if(result) user=false;
    });

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        err&&(console.log(err));

        bcrypt.hash(user.password,salt,function(err,hash){
            err&&(console.log(err));
            user.password=hash;

            new User(user).save(function (err, result) {

                if (err) console.log(err);
                req.session.signup=true;
                res.json({state:1});
                console.log("zhuche");
            });
        });
    });


};


        // if(captcha.toLowerCase()!==req.session.captcha){
        //     res.json({state:5});
        //     return;
        // }
//sign in page
exports.signin=function (req, res) {
    var user = req.body.user;

    var {name,password,captcha}=user;

    User.findOne({name: name}, function (err, user) {
        if (err) console.log(err);
        if (!user) return res.json({state: 1});
        console.log('zheshige duandian');

        user.comparePassword(password, function (err, isMatched) {
            if (err) console.log(err);
            if (isMatched) {
                req.session.user=user;
                res.json({state:4,user:user});
            }
            else {
                res.json({state: 2});
            }
        });
    });
};


//注册验证账户和邮箱

exports.verify=function (req, res) {
    for(let data in req.query) {
        var sample={};sample[data]=req.query[data];
        User.findOne(sample, function(err, result){
            if(err) console.log(err);

        if (result) res.json({state: 0});
        else res.json({state: 1});
    });
    }
};

//退出登录状态
exports.logout=function (req, res) {
    delete req.session.user;
    delete req.session.orders;

        res.redirect('/');

};

//拒绝访问
exports.refused=function(req,res){
    res.render('refused',{title:'SilentSword'});
};

//激活账户
exports.activateAccount=function(req,res){

    User.update({_id:req.params.id},{$set:{role:0}}).exec(function(err,result){
        if(err) console.log(err);

        User.update({_id:req.params.id},{$unset:{expiretime:''}}).exec(function(err){
            err&&(console.log(err));

            res.render('activated');
        });

    });

};

//个人空间
exports.userSpace=function(req,res){

    User.findOne({_id:req.session.user._id}).populate('favourites').exec(function(err,userSpace){
console.log(userSpace);
        if(err) console.log(err);

        var books=userSpace.favourites;
        Order.find({user:userSpace.id}).where({finished:true}).exec(function(err,orders){
            console.log(orders)
            if(orders){
            res.render('userSpace',{
            title:userSpace.name+'的个人空间',
            masterView:(req.session.user&&req.session.user._id)==req.params.id,  //确定查看个人空间的是游客还是用户,
            books:books,
            userSpace:userSpace,
            order:req.session.orders,
            orders:orders
        });
            }else{
            res.render('userSpace',{
            title:userSpace.name+'的个人空间',
            masterView:(req.session.user&&req.session.user._id)==req.params.id,  //确定查看个人空间的是游客还是用户,
            books:books,
            userSpace:userSpace,
            order:req.session.orders
            // orders:""
             });
            }
            
        });
     
    });

};
exports.deleteUser=function (req, res) {
    var id = req.query.id;
    User.findOne({_id:id}).exec(function(err,user){
         User.remove({_id: id}, function(err){ 

            Order.remove({user:id}).exec(function(){});
            Comment.remove({from:id}).exec(function(){});
 
         res.json({state: 1});    
        });
       
    });
};
exports.checkUser=function (req, res) {
    var id = req.query.id;
    User.findOne({_id:id}).exec(function(err,user){
        
         res.json({state: 1,user:user});    
        });
       

};

//添加收藏
exports.addFavourites=function(req,res){

    Book.findOne({title:req.query.title}).exec(function(err,book){
        if(err) console.log(err);
        // console.log("1111"+book);
        User.findOne({_id:req.session.user._id}).exec(function(err,user){
            if(user.favourites.indexOf(book._id)!==-1){
                res.json({state:0});
                return;
            }

            if(err) console.log(err);
            user.favourites.push(book._id);

            user.save(function(err){
                err&&(console.log(err));

                res.json({state:1});
            });
        });
    });
};

//删除收藏
exports.deleteFavourite=function(req,res){

    Book.findOne({title:req.query.title}).exec(function(err,book){
        if(err) console.log(err);

        User.findOne({_id:req.session.user._id}).exec(function(err,user){
            user.favourites.remove(book._id);

            user.save(function(err){
                err&&(console.log(err));

                res.json({state:1});
            });
        });
    });
};
//用户列表
exports.userList=function (req, res) {


    User.fetch(function (err, user) {
        err&&(console.log(err));

        res.render('userlist', {
            title: '用户 列表页',
            users:user,
                order:req.session.orders
        });
    });
};

//上传图片
exports.updateHead=function(req,res){

    if(!/default/.test(req.session.user.headpath))  //如果不是default.jpg就删除
        fs.unlink('public'+req.session.user.headpath,function(err){
            console.log(err);
        });

    var form=new Form.IncomingForm();

    form.uploadDir = 'public/images/tmp';  //以当前项目根目录为初始目录

    form.parse(req,function(err,fields,file){

        var oldPath=file.postPic.path,
            type=file.postPic.name.slice(file.postPic.name.lastIndexOf('.')+1),
            target=`public/images/userHeads/${req.session.user._id}.${type}`;

        fs.rename(oldPath,target,function(err){
            if(err) console.log(err);

            User.update({_id:req.session.user._id},{$set:{headpath:target.slice(6)}}).exec(function(err){
                console.log(err);

                res.end();
            });
        });
    });
};


//权限认证
exports.authorityRequired=function (req, res,next) {
    var user=req.session.user;

    if(user&&user.role>100) next();
    else if(req.get('X-Requested-With')=='XMLHttpRequest')  res.json({state:0});
    else    res.redirect('/refused');
};

//获取验证码
exports.getCaptcha=function(req,res){

    var data=captcha.get();

    req.session.captcha=data[0].toLowerCase();

    res.json({state:'data:image/png;base64,'+data[1].toString('base64')});
};



