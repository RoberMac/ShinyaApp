var geo_helper        = require('./geo_helper'),
    email_helper      = require('./email_helper'),
    getBeginPlace     = require('./begin_place_helper'),
    getCountryAndCity = geo_helper.getCountryAndCity,
    getCityWeather    = geo_helper.getCityWeather,
    getTodayMs        = geo_helper.getTodayMs,
    getGeoWeather     = geo_helper.getGeoWeather;

// Q
var q_userFindOne = Q.nbind(User.findOne, User),
    q_userFindOneAndUpdate = Q.nbind(User.findOneAndUpdate, User),
    q_count       = Q.nbind(User.count, User);

function queryError(err, next){
    log.error('[DB: Query Error]', err)
    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
    throw new Error('Query Error')
}

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
                    // 檢查 用戶名 & 電郵地址 是否存在
                    Q.all([
                        q_userFindOne({username: username}),
                        q_userFindOne({email: email})
                        ])
                    .spread(function (userFound, emailFound){
                        if (userFound){
                            next({'code': 400, 'status': 'error', 'msg': '用戶名已存在'})
                            throw '[Register: Username Existed] ' + username
                        } else if (emailFound){
                            next({'code': 400, 'status': 'error', 'msg': '電郵地址已存在'})
                            throw '[Register: Email Address Existed] ' + email
                        } else {
                            return '用戶名 & 電郵地址 √'
                        }
                    }, function (err){
                        queryError(err, next)
                    })
                    .then(function (){
                        // 獲取 國家代碼 & 城市名 & 起始位置天氣
                        return Q.all([
                            getCountryAndCity(register_form.register_info.ip),
                            getGeoWeather(place.lat, place.lon)
                            ])
                        .then(function (data){
                            return data
                        })
                    })
                    .spread(function (countryAndCity, beginWeather){
                        // 獲取用戶註冊城市天氣
                        return getCityWeather(countryAndCity[1])
                        .then(function (weather){
                            return [countryAndCity, beginWeather, weather]
                        })
                    })
                    .spread(function (countryAndCity, beginWeather, weather){
                        // 獲取當前註冊用戶數
                        return q_count({})
                        .then(function (count){
                            return [countryAndCity, beginWeather, weather, count]
                        }, function (err){
                            queryError(err, next)
                        })
                    })
                    .spread(function (countryAndCity, beginWeather, weather, count){
                        // 初始化用戶數據
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
                                'country': countryAndCity[0],
                                'city'   : countryAndCity[1],
                                'weather': weather
                            },
                            'isGeoServices': false
                        })
                        // 保存到數據庫
                        var q_userSave = Q.nbind(user.save, user)
                        q_userSave()
                        .then(function (){
                            log.info('[Register: Success]', username)
                            res.json({'status': 'ok', 'msg': '註冊成功'})
                            email_helper.send_log_email(
                                'shenyepoxiao@gmail.com',
                                '新用戶加入',
                                '新用戶：' + username)
                        }, function (err){
                            log.error('[DB: Save Error]', err)
                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                        })
                    })
                    .fail(function (err){
                        log.warning(err)
                    })
                    .done()
                } else {
                    log.warning('[Register: Wrong Username] maximum 16 characters')
                    next({'code': 400, 'status': 'error', 'msg': '用戶名不能超過十六個字符'})
                }
            } else {
                log.warning('[Register: Wrong Username] cannot contain spaces')
                next({'code': 400, 'status': 'error', 'msg': '用戶名不能包含空格'})
            }
        } else {
            log.warning('[Register: Wrong Email Address]')
            next({'code': 400, 'status': 'error', 'msg': '電郵地址有誤'})
        }
    },
    login: function (login_form, validator, bcrypt, jwt, User, key, res, next){
        // 檢查密碼是否存在
        if (!login_form.password){
            log.warning('[Login: Required Password]', login_form.user)
            next({'code': 400, 'status': 'error', 'msg': '請輸入密碼'})
        } else {
            if (validator.isEmail(login_form.user)){
                // 以電郵地址登陸
                q_login({email: validator.normalizeEmail(login_form.user)}, 
                    'username password email register_info geo_info isGeoServices')
            } else {
                // 以用戶名登陸
                q_login({username: login_form.user}, 
                    'username password email register_info geo_info isGeoServices')
            }
        }
        function q_login(condition, restrict){
            q_userFindOne(condition, restrict)
            .then(function (found){
                // 檢查用戶是否存在
                if (!found){
                    next({'code': 400, 'status': 'error', 'msg': '用戶不存在'})
                    throw '[Login: User Does Not Existed] ' + login_form.user
                } else {
                    // 檢查密碼是否正確
                    var compare_password = found.password || ''
                    if (bcrypt.compareSync(login_form.password, compare_password)){
                        var token = jwt.sign({
                            'username': found.username,
                            'numero': found.register_info.numero,
                            'date': found.register_info.date,
                            'weather': found.geo_info.weather,
                            'isGeoServices': found.isGeoServices
                        }, key, {
                            expiresInMinutes: 60 * 24 * 7
                        })
                        log.info('[Login: Success]', login_form.user)
                        res.json({'token': token})
                    } else {
                        next({'code': 400, 'status': 'error', 'msg': '密碼有誤'})
                        throw '[Login: Wrong Password] ' + login_form.user
                    }
                }
            }, function (err){
                queryError(err, next)
            })
            .fail(function (err){
                log.warning(err)
            })
            .done()
        }
    },
    forgot_email: function (forgot_email_form, User, jwt, key, res, next){

        // 生成驗證碼
        var code = jwt.sign({
            email: forgot_email_form.email,
        }, key, {
            expiresInMinutes: 60
        })
        q_userFindOneAndUpdate({email: forgot_email_form.email}, {forgot_code: code})
        .then(function (found){
            // 檢查電郵地址是否存在
            if (!found){
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
                throw '[Forgot: Email Address Does Not Existed] ' + forgot_email_form.email
            } else {
                // 發送驗證碼到用戶郵箱
                email_helper.forgot_email(forgot_email_form.email, code)
                log.info('[Forgot: Step One Success]')
                res.json({'status': 'ok', 'msg': '請輸入收到的驗證碼'})
            }
        }, function (err){
            queryError(err, next)
        })
        .fail(function (err){
            log.warning(err)
        })
        .done()
    },
    forgot_code: function (update_form, User, res, next){

        // 檢查驗證碼是否最新鮮，因為有可能同時存在多個新鮮的驗證碼
        q_userFindOne({email: update_form.email})
        .then(function (found){
            if (!found) {
                next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
                throw '[Forgot: Email Address Does Not Existed] ' + update_form.email
            } else if (found.forgot_code === update_form.code){
                // 驗證碼最新鮮
                q_userFindOneAndUpdate({email: update_form.email}, {
                        'password': update_form.password,
                        'forgot_code': '',
                    })
                .then(function (found){
                    if(!found){
                        next({'code': 400, 'status': 'error', 'msg': '電郵地址不存在'})
                        throw '[Forgot: Email Address Does Not Existed] ' + update_form.email
                    } else {
                        log.info('[Forgot: Change Password Success]')
                        res.json({'status': 'ok', 'msg': '修改密碼成功'})
                    }
                })
            } else {
                next({'code': 400, 'status': 'error', 'msg': '請輸入最新的驗證碼'})
                throw '[Forgot: Not Fresh Code] ' + update_form.email
            }
        }, function (err){
            queryError(err, next)
        })
        .fail(function (err){
            log.warning(err)
        })
        .done()
    }
}

module.exports = db_helper