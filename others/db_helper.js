var nodemailer    = require('nodemailer'),
    getGeo        = require('./geo_helper'),
    getNews       = require('./rss_helper');

// 每隔 30 分鐘抓取一次新聞
var latest_news = []
getNews(function (news){
    latest_news = news
    console.log(Date() + ' :')
    console.log(latest_news)
})
setInterval(function (){
    getNews(function (news){
        latest_news = news
        console.log(Date() + ' :')
        console.log(latest_news)
    })
}, 300000)

var db_helper = {
    register: function (register_form, validator, User, res, next){

        // 檢查郵箱
        if (validator.isEmail(register_form.email)){
            //檢查用戶名
            if (register_form.username.search(/\s/) < 0){
                if (validator.isLength(register_form.username, 1, 16)){
                    // 檢查用戶名是否存在
                    User.findOne({username: register_form.username}, function (err, found){

                        if (err){
                            next({'code': 500, 'status': 'error', 'msg': 'Server Error'})
                            return err
                        }
                        if (found){
                            next({'code': 400, 'status': 'error', 'msg': '用戶名已存在'})
                        } else {
                            // 檢查電郵地址是否存在
                            User.findOne({email: register_form.email}, function (err, found){

                                if (err){
                                    next({'code': 500, 'status': 'error', 'msg': 'Server Error'})
                                    return err
                                }
                                if (found){
                                    next({'code': 400, 'status': 'error', 'msg': '電郵地址已存在'})
                                } else {
                                    // 獲取當前註冊用戶數
                                    User.count({}, function (err, count){
                                        if (err){
                                            next({'code': 500, 'status': 'error', 'msg': 'Server Error'})
                                            return err
                                        }
                                        // 保存到數據庫
                                        var user = new User({
                                            'username': register_form.username,
                                            'email': register_form.email,
                                            'password': register_form.password,
                                            'register_info': register_form.register_info,
                                            'other_info': {
                                                'numero': count,
                                                'news'  : latest_news,
                                                'geo'   : getGeo(register_form.register_info.ip)
                                            }
                                        })
                                        user.save(function (err){
                                            if (err){
                                                next({'code': 400, 'status': 'error', 'msg': '用戶名或電郵地址已存在'})
                                                return err
                                            }
                                            res.json({'status': 'ok', 'msg': '註冊成功'})
                                        })
                                    })
                                }
                            })
                        }
                    })
                } else {
                        res.json({'status': 'error', 'msg': '用戶名不能超過十六個字符'})
                }
            } else {
                next({'code': 400, 'status': 'error', 'msg': '用戶名不能包含空格'})
            }
        } else {
            next({'code': 400, 'status': 'error', 'msg': '電郵地址有誤'})
        }    
    },
    login: function (login_form, validator, bcrypt, jwt, User, key, res, next){

        if (validator.isEmail(login_form.user)){
            console.log(validator.normalizeEmail(login_form.user))
            User.findOne({email: validator.normalizeEmail(login_form.user)}, 'username password email register_info other_info', function (err, found){
                if (err) return err
                // 檢查用戶是否存在
                if (!found){
                    console.log('Not Found')
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {
                    // 檢查密碼是否正確
                    var compare_password = found.password
                    if (bcrypt.compareSync(login_form.password, compare_password)){
                        var token = jwt.sign({
                            username: found.username,
                            numero: found.other_info.numero,
                            date: found.register_info.date
                        }, key, {
                            expiresInMinutes: 1
                        })
                        res.json({'token': token})
                    } else {
                        next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                    }
                }
            }) 
        } else {
            User.findOne({username: login_form.user}, 'username password email register_info other_info', function (err, found){
                if (err) return err
                // 檢查用戶是否存在
                if (!found){
                    console.log('Not Found')
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {
                    // 檢查密碼是否正確
                    var compare_password = found.password
                    if (bcrypt.compareSync(login_form.password, compare_password)){
                        var token = jwt.sign({
                            username: found.username,
                            numero: found.other_info.numero,
                            date: found.register_info.date
                        }, key, {
                            expiresInMinutes: 1
                        })
                        res.json({'token': token})
                    } else {
                        next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                    }
                }
            })            
        }

    },
    forgot_email: function (forgot_email_form, User, jwt, key, res, next){

        // 生成驗證碼
        var code = jwt.sign({
            email: forgot_email_form.email,
        }, key, {
            expiresInMinutes: 60
        })
        console.log(code)
        User.findOneAndUpdate({email: forgot_email_form.email}, {other_info: {code: code}}, function (err, found){
            if (err) return err
            // 檢查電郵地址是否存在
            if (!found){
                console.log('email not found')
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'}) 
            } else {
                // 發送驗證碼到用戶郵箱
                var transporter = nodemailer.createTransport({
                    service: 'Yahoo',
                    auth: {
                        user: 'shenyepoxiao@yahoo.com',
                        pass: '4sfaxiLHMMvNnT('
                    }
                });
                var mailOptions = {
                    from: '深夜，破曉 <shenyepoxiao@yahoo.com>',
                    to: forgot_email_form.email,
                    subject: '尋找你的帳戶',
                    html: '<div style=\'white-space: pre-wrap; word-break: break-all; margin: 0 auto; width: 300px;'
                            + 'font-family: "Helvetica Neue","Palatino","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;\'>'
                            + '<h3 style=\'letter-spacing: 3px; font-size: 16px; text-align: center;\'>驗證碼</h3>'
                            + '<p style=\'font-size:11px; text-align: center; color: #555;\'>'
                            + code + 
                            '</p><p style=\'font-size: 12px; text-align: center; color:#CECECF;\'>請在 60 分鐘內驗證</p><div>'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error){
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
                res.json({'status': 'ok', 'msg': '請輸入收到的驗證碼'})
            }
        })
    },
    forgot_code: function (update_form, User, res, next){

        // 檢查驗證碼是否最新鮮，因為有可能同時存在多個新鮮的驗證碼
        User.findOne({email: update_form.email}, function (err, found){
            if (err) return err
            console.log('update_form.email'+update_form.email)
            if (!found) {
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
            } else {
                // 驗證碼最新鮮
                if (found.other_info.code === update_form.code){
                    User.findOneAndUpdate({email: update_form.email}, {password: update_form.password}, function (err, found){
                        if (err) return err
                        if (!found) {
                            next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
                        } else {
                            res.json({'status': 'ok', 'msg': '修改密碼成功'})
                        }
                    })
                } else {
                    next({'code': 400, 'status': 'error', 'msg': '請輸入最新的驗證碼'})
                }
            }
        })

    }
}

module.exports = db_helper