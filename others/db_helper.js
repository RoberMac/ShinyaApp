var nodemailer        = require('nodemailer'),
    geo_helper        = require('./geo_helper'),
    getBeginPlace     = require('./begin_place_helper'),
    getCountryAndCity = geo_helper.getCountryAndCity,
    getCityWeather    = geo_helper.getCityWeather,
    getTodayMs        = geo_helper.getTodayMs,
    getGeoWeather     = geo_helper.getGeoWeather;

var db_helper = {
    register: function (register_form, validator, User, res, next){

        var username = register_form.username,
            password = register_form.password,
            email    = register_form.email,
            place    = getBeginPlace(),
            date     = new Date();

        // 檢查郵箱
        if (validator.isEmail(email)){
            //檢查用戶名
            if (username.search(/\s/) < 0){
                if (validator.isLength(username, 1, 16)){
                    // 檢查用戶名是否存在
                    User.findOne({username: username}, function (err, found){
                        if (err){
                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                            return err
                        }
                        if (found){
                            next({'code': 400, 'status': 'error', 'msg': '用戶名已存在'})
                        } else {
                            // 檢查電郵地址是否存在
                            User.findOne({email: email}, function (err, found){
                                if (err){
                                    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                    return err
                                }
                                if (found){
                                    next({'code': 400, 'status': 'error', 'msg': '電郵地址已存在'})
                                } else {
                                    // 獲取當前註冊用戶數
                                    User.count({}, function (err, count){
                                        if (err){
                                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                            return err
                                        }
                                        // 獲取 國家代碼 和 城市名
                                        getCountryAndCity('14.18.190.188', function (country, city){
                                            getGeoWeather(place.lat, place.lon, function (beginWeather){
                                                // 獲取城市天氣
                                                getCityWeather(city, function (weather){
                                                    // 保存到數據庫
                                                    var user = new User({
                                                        'username': username,
                                                        'email': email,
                                                        'password': password,
                                                        'register_info': {
                                                            'ip'      : register_form.register_info.ip,
                                                            'date'    : register_form.register_info.date,
                                                            'platform': register_form.register_info.platform,
                                                            'numero'  : count,
                                                        },
                                                        'last_geo': {
                                                            lat: place.lat,
                                                            lon: place.lon,
                                                            location: place.name,
                                                            date: new Date(),
                                                            weather: beginWeather
                                                        },
                                                        'geo_info': {
                                                            'country': country,
                                                            'city'   : city,
                                                            'weather': weather
                                                        },
                                                        'isGeoServices': false
                                                    })
                                                    console.log(user)
                                                    user.save(function (err){
                                                        if (err){
                                                            next({'code': 400, 'status': 'error', 'msg': '用戶名或電郵地址已存在'})
                                                            return err
                                                        }
                                                        res.json({'status': 'ok', 'msg': '註冊成功'})
                                                        console.log('地理位置信息已保存')
                                                    })
                                                })
                                            })

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
            User.findOne({email: validator.normalizeEmail(login_form.user)}, 'username password email register_info geo_info isGeoServices', function (err, found){
                if (err) return err
                // 檢查用戶是否存在
                if (!found){
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {
                    if (!login_form.password){
                            next({'code': 400, 'status': 'error', 'msg': '請輸入密碼'})
                    } else {
                        // 檢查密碼是否正確
                        var compare_password = found.password
                        if (bcrypt.compareSync(login_form.password, compare_password)){
                            var token = jwt.sign({
                                'username': found.username,
                                'numero': found.register_info.numero,
                                'date': found.register_info.date,
                                'weather': found.geo_info.weather,
                                'isGeoServices': found.isGeoServices
                            }, key, {
                                expiresInMinutes: 1
                            })
                            res.json({'token': token})
                        } else {
                            next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                        }
                    }
                }
            }) 
        } else {
            User.findOne({username: login_form.user}, 'username password email register_info geo_info isGeoServices', function (err, found){
                if (err) return err
                // 檢查用戶是否存在
                if (!found){
                    console.log('Not Found')
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {

                    if (!login_form.password){
                            next({'code': 400, 'status': 'error', 'msg': '請輸入密碼'})
                    } else {
                        // 檢查密碼是否正確
                        var compare_password = found.password
                        if (bcrypt.compareSync(login_form.password, compare_password)){
                            var token = jwt.sign({
                                'username': found.username,
                                'numero': found.register_info.numero,
                                'date': found.register_info.date,
                                'weather': found.geo_info.weather,
                                'isGeoServices': found.isGeoServices
                            }, key, {
                                expiresInMinutes: 1
                            })
                            res.json({'token': token})
                        } else {
                            next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                        }
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
        User.findOneAndUpdate({email: forgot_email_form.email}, {forgot_code: code}, function (err, found){
            if (err) return err
            // 檢查電郵地址是否存在
            if (!found){
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'}) 
            } else {
                // 發送驗證碼到用戶郵箱
                var transporter = nodemailer.createTransport({
                    service: 'Yahoo',
                    auth: {
                        'user': 'shenyepoxiao@yahoo.com',
                        'pass': '4sfaxiLHMMvNnT('
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
            console.log('update_form.email' + update_form.email)
            if (!found) {
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
            } else {
                // 驗證碼最新鮮
                if (found.forgot_code === update_form.code){
                    User.findOneAndUpdate({email: update_form.email}, {
                        'password': update_form.password,
                        'forgot_code': '',
                    }, function (err, found){
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