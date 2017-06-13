var Book = require('../models/book');
var Comment=require('../models/comment');
var Category=require('../models/category');
var User=require('../models/user');
var request=require('request');
var _ = require('underscore');
var Form=require('formidable');
var fs=require('fs');
var path = require('path');


function classify(result){   //根据保存到book中的电影数据进行分类
    for(let item of result.category)
        Category.findOne({name:item}).exec(function(err,category){
              if(!category){
             var category = new Category({
                name:item
             })
        }
            category.books.push(result._id);
            category.save(function(err){
                err&&(console.log(err));
            });
        })

    Category.findOne({name:result.country}).exec(function(err,category){
        if(!category){
             var category = new Category({
                name:result.country
             })
        }
        category.books.push(result._id);
        category.save(function(err){
            err&&(console.log(err));

        });
    });

    Category.findOne({name:result.year}).exec(function(err,category){
        if(!category){
             var category = new Category({
                name:result.year
             })
        }
        category.books.push(result._id);
        category.save(function(err){
            err&&(console.log(err));
        });
    });
}


//Bookdetail page
exports.bookDetail=function (req, res) {
    // console.log(req.session.orders);
    var id = req.params.id;
    Book.findById(id, function (err, book) {

        err&&(console.log(err));

        var liked=[];  //获取用户点赞id
        if(req.session.user)
            new Promise(function(resolve,reject){  //如果用户已登录,则同步执行获取点赞id
                User.findOne({_id:req.session.user._id}).exec(function(err,result){
                    err&&(console.log(err));
                    liked=result.liked;
                    resolve();
                });
            });

        Comment.find({bookId:id}).populate('from').sort({likes:-1}).exec(function(err,comments){
            err&&(console.log(err));

            comments.forEach(function(ele,index){
                if(ele.to)
                    comments.splice(index,1);
            });

            if(liked.length!==0)
                comments.forEach(function(ele,index){

                    for(let item of liked)
                        if(ele._id.toString()==item.toString()){
                            comments[index].commented=true;
                            return;
                        }
                });

            res.render('detail', {
                title: book.title.replace(/\s/g,''),
                book: book,
                comments:comments,
                order:req.session.orders
            });


        });
    })
};

//Books list page
exports.bookList=function (req, res) {


    Book.fetch(function (err, books) {
        err&&(console.log(err));

        res.render('list', {
            title: '书籍 列表页',
            books: books,
                order:req.session.orders
        });
    });
};


//admin page
exports.addBook=function (req, res) {
    res.render('admin', {
        title: '书籍 后台录入页',
                order:req.session.orders
    })
};

exports.savePoster = function(req,res,next){
    // console.log(req.files);
    var posterData = req.files.poster;

    var filePath = posterData.path;
    var originalFilemane = posterData.originalFilename;

    if(originalFilemane){
        fs.readFile(filePath,function(err,data){
            var timestamp = Date.now();
            var type = posterData.type.split("/")[1];
            var poster = timestamp + "."+type;
            var newPath = path.join(__dirname,'../../public','/images/book/'+poster);
            // console.log(newPath);
            fs.writeFile(newPath,data,function(err){
                req.poster = poster;
                next();
            });
        })
    }else{
        next();
    }
}

//admin post book

exports.addBookP=function (req, res) {

    // console.log(req.body);

    // var id=req.body.book._id;
    var bookObj = req.body.book;
    var _book;
   
    _book = new Book({
        title:bookObj.title,
        auther:bookObj.auther,
        country:bookObj.country,
        summary:bookObj.summary,
        poster:req.poster,
        price:bookObj.price,
        year:bookObj.year,
        category:bookObj.category
    });
     classify(_book);
     _book
     .save(function(err,book){
        if(err){
             console.log(err);
        }
             

        })

     .then(function(){
         res.redirect('/' );

     });

};
exports.change = function(req,res){
    var id = req.params.id;
    Book.findOne({_id:id}).exec(function(err,book){
        res.render("change",{
            title:'书籍 修改页',
            book:book
        })
    })

}
exports.changeP = function(req,res){
    var id = req.params.id;

     var bookObj = req.body.book;
    var _book;
 Book.findOne({_id:id}).exec(function(err,book){ 
        if(req.poster){
        // fs.unlink(__dirname+'/../../public/images/book/'+book.poster,function(err){
        //     if(err) console.log(err);
        // });
        book.poster = req.poster;
        }
        for(let item of book.category) //从category删除对应的分类id
                Category.findOne({name:item}).exec(function(err,result){
                    result.books.remove(id);
                    result.save(function(err){
                        err&&(console.log(err));
                    });
                });

        Category.findOne({name:book.year}).exec(function(err,result){  //删除年份分类

                result.books.remove(id);
                result.save(function(err){
                    err&&(console.log(err));
                });
            }); 

        Category.findOne({name:book.country}).exec(function(err,result){  //删除国家分类
                result.books.remove(id);
                result.save(function(err){
                    err&&(console.log(err));
                });
            });
        book.title = bookObj.title;
        book.auther = bookObj.auther;
        book.country = bookObj.country;
        book.summary = bookObj.summary;
        book.price = bookObj.price;
        book.year = bookObj.year;
        

        book.category = bookObj.category
    
     classify(book);
     book
     .save(function(err,book){
        if(err){
             console.log(err);
        }             
        })

     .then(function(){
         res.redirect('/admin/list' );

     }); 
 });
}

//delete
exports.deleteBook=function (req, res) {
    var id = req.query.id;
    Book.findOne({_id:id}).exec(function(err,book){
         Book.remove({_id: id}, function(err){ 
            console.log(id);
            for(let item of book.category) //从category删除对应的分类id
                Category.findOne({name:item}).exec(function(err,result){
                    result.books.remove(id);
                    result.save(function(err){
                        err&&(console.log(err));
                    });
                });

            Category.findOne({name:book.year}).exec(function(err,result){  //删除年份分类

                result.books.remove(id);
                result.save(function(err){
                    err&&(console.log(err));
                });
            }); 

            Category.findOne({name:book.country}).exec(function(err,result){  //删除国家分类
                result.books.remove(id);
                result.save(function(err){
                    err&&(console.log(err));
                });
            });

            Comment.find({bookId:id}).exec(function(err,comments){


                err&&(console.log(err));
                var commentIdGroup=[];   //收集所有被删除的评论id用于删除相关用户对评论点赞

                for(let item of comments)
                    commentIdGroup.push(item._id);

                User.find({}).exec(function(err,users){
                    for(let itemU of users) {
                        for (let itemC of commentIdGroup)
                            if (itemU.liked.indexOf(itemC) !== -1)
                                itemU.liked.splice(itemU.liked.indexOf(itemC), 1);

                        new Promise(function (resolve, reject) {
                            itemU.save(function(){
                                resolve();
                            })
                        });
                    }

                });

                Comment.remove({bookId:id}).exec(function(){});
           

            res.json({state: 1}); });
         });
    });
};

//验证id或者title
exports.verify=function(req,res){
 

       Book.findOne({title:req.query.title}).exec(function(err,result){
           err&&(console.log(err));

           if(result) res.json({state:0});
           else res.json({state:1});
    });
}



