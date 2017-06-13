/* 
* @Author: anchen
* @Date:   2017-05-17 11:35:51
* @Last Modified by:   anchen
* @Last Modified time: 2017-05-17 12:00:36
*/

var Book = require('../models/book');
var Category=require('../models/category');
            var cat;

            var countries=['中国','美国','韩国','日本','德国','法国','英国','泰国','印度','意大利','其他'];
            for (var i = countries.length - 1; i >= 0; i--) {
                console.log(countries[i]);

                cat = new Category(
                    {
                        name:countries[i],
                        books:[]
                    }
                    )
                cat.save(function(err){
                        if(err) console.log(err);
                console.log("nice");

                    });
            };
            var categories=['动作','喜剧','爱情','科幻','恐怖','惊悚','灾难','悬疑','奇幻','战争','犯罪','历史','自然','武侠','剧情','家庭'];
            for (var i = categories.length - 1; i >= 0; i--) {
                cat = new Category(
                    {
                        name:categories[i],
                        books:[]
                    }
                    )
                cat.save(function(err){
                        if(err) console.log(err);
                        console.log("nice");

                    });
            };
            for(var i=2016;i>2002;i--){
                cat = new Category(
                    {
                        name:i,
                        books:[]
                    }
                    )
                cat.save(function(err){
                        if(err) console.log(err);
                console.log("nice");

                    });
            };

