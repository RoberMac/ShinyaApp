var geo_helper        = require('./geo_helper'),
    email_helper      = require('./email_helper'),
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
                            log.error('[DB: Query Error]', err)
                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                            return err
                        }
                        if (found){
                            log.warning('[Register: Username Existed]', username)
                            next({'code': 400, 'status': 'error', 'msg': '用戶名已存在'})
                        } else {
                            // 檢查電郵地址是否存在
                            User.findOne({email: email}, function (err, found){
                                if (err){
                                    log.error('[DB: Query Error]', err)
                                    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                    return err
                                }
                                if (found){
                                    log.warning('[Register: Email Address Existed]', email)
                                    next({'code': 400, 'status': 'error', 'msg': '電郵地址已存在'})
                                } else {
                                    // 獲取當前註冊用戶數
                                    User.count({}, function (err, count){
                                        if (err){
                                            log.error('[DB: Query Error]', err)
                                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                            return err
                                        }
                                        // 獲取 國家代碼 和 城市名
                                        getCountryAndCity('203.198.69.77', function (country, city){
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
                                                    user.save(function (err){
                                                        log.info('[Register: Saving]', username)
                                                        if (err){
                                                            log.error('[DB: Save Error]', err)
                                                            next({'code': 400, 'status': 'error', 'msg': '用戶名或電郵地址已存在'})
                                                            return err
                                                        }
                                                        log.info('[Register: Success]', username)
                                                        res.json({'status': 'ok', 'msg': '註冊成功'})
                                                        email_helper.send_log_email('shenyepoxiao@gmail.com', '新用戶加入', '新用戶：' + username)
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
                    log.warning('[Register: Wrong Username]', 'maximum 16 characters')
                    res.json({'status': 'error', 'msg': '用戶名不能超過十六個字符'})
                }
            } else {
                log.warning('[Register: Wrong Username]', 'cannot contain spaces')
                next({'code': 400, 'status': 'error', 'msg': '用戶名不能包含空格'})
            }
        } else {
            log.warning('[Register: Wrong Email Address]')
            next({'code': 400, 'status': 'error', 'msg': '電郵地址有誤'})
        }
    },
    login: function (login_form, validator, bcrypt, jwt, User, key, res, next){

        if (validator.isEmail(login_form.user)){

            User.findOne({email: validator.normalizeEmail(login_form.user)}, 'username password email register_info geo_info isGeoServices', function (err, found){
                if (err) {
                    log.error('[DB: Query Error]', err)
                    return err
                }
                // 檢查用戶是否存在
                if (!found){
                    log.warning('[Login: User Does Not Existed]', login_form.user)
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {
                    if (!login_form.password){
                        log.warning('[Login: Required Password]', login_form.user)
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
                                expiresInMinutes: 60
                            })
                            log.info('[Login: Success]', login_form.user)
                            res.json({'token': token})
                        } else {
                            log.warning('[Login: Wrong Password]', login_form.user)
                            next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                        }
                    }
                }
            }) 
        } else {

            User.findOne({username: login_form.user}, 'username password email register_info geo_info isGeoServices', function (err, found){
                if (err) {
                    log.error('[DB: Query Error]', err)
                    return err
                }
                // 檢查用戶是否存在
                if (!found){
                    log.warning('[Login: User Does Not Existed]', login_form.user)
                    res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                } else {
                    if (!login_form.password){
                        log.warning('[Login: Required Password]', login_form.user)
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
                                expiresInMinutes: 60
                            })
                            log.info('[Login: Success]', login_form.user)
                            res.json({'token': token})
                        } else {
                            log.warning('[Login: Wrong Password]', login_form.user)
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
            if (err) {
                log.error('[DB: Query Error]', err)
                return err
            }
            // 檢查電郵地址是否存在
            if (!found){
                log.warning('[Forgot: Email Address Does Not Existed]', forgot_email_form.email)
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'}) 
            } else {

                // 發送驗證碼到用戶郵箱
                email_helper.forgot_email(forgot_email_form.email, code)
                log.info('[Forgot: Step One Success]')
                res.json({'status': 'ok', 'msg': '請輸入收到的驗證碼'})
            }
        })
    },
    forgot_code: function (update_form, User, res, next){

        // 檢查驗證碼是否最新鮮，因為有可能同時存在多個新鮮的驗證碼
        User.findOne({email: update_form.email}, function (err, found){
            if (err) {
                log.error('[DB: Query Error]', err)
                return err
            }
            if (!found) {
                log.warning('[Forgot: Email Address Does Not Existed]', forgot_email_form.email)
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
            } else {
                // 驗證碼最新鮮
                if (found.forgot_code === update_form.code){
                    User.findOneAndUpdate({email: update_form.email}, {
                        'password': update_form.password,
                        'forgot_code': '',
                    }, function (err, found){
                        if (err) {
                            log.error('[DB: Query Error]', err)
                            return err
                        }
                        if (!found) {
                            log.warning('[Forgot: Email Address Does Not Existed]', forgot_email_form.email)
                            next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
                        } else {
                            log.info('[Forgot: Change Password Success]')
                            res.json({'status': 'ok', 'msg': '修改密碼成功'})
                        }
                    })
                } else {
                    log.warning('[Forgot: Not Fresh Code]')
                    next({'code': 400, 'status': 'error', 'msg': '請輸入最新的驗證碼'})
                }
            }
        })
    }
}

module.exports = db_helper