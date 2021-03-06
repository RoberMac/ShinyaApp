var geo_helper        = require('./geo_helper'),
    email_helper      = require('./email_helper'),
    getBeginPlace     = require('./begin_place_helper'),
    getCountryAndCity = geo_helper.getCountryAndCity,
    getCityWeather    = geo_helper.getCityWeather,
    getGeoWeather     = geo_helper.getGeoWeather;

// Q
var q_userFindOne = Q.nbind(User.findOne, User),
    q_userFindOneAndUpdate = Q.nbind(User.findOneAndUpdate, User),
    q_count       = Q.nbind(User.count, User);

function queryError(err, next){
    next({'code': 500, 'status': 'error', 'msg': 'error.SERVER_ERROR'})
    throw new Error('Query Error')
}

var db_helper = {
    register: function (register_form, validator, res, next){

        var username = register_form.username,
            password = register_form.password,
            email    = register_form.email,
            place    = getBeginPlace(),
            date     = new Date();

        // 檢查郵箱
        if (!validator.isEmail(email)){
            next({'code': 400, 'status': 'error', 'msg': 'error.EMAIL_INCORRECT'})
            return;
        }
        //檢查用戶名
        if (username.search(/\s/) >= 0){
            next({'code': 400, 'status': 'error', 'msg': 'error.USERNAME_SPACES'})
            return;
        }
        if (!validator.isLength(username, 1, 16)){
            next({'code': 400, 'status': 'error', 'msg': 'error.USERNAME_LENGTH'})
            return;
        }
        // 檢查 用戶名 & 電郵地址 是否存在
        Q.all([
            q_userFindOne({username: username}),
            q_userFindOne({email: email})
            ])
        .spread(function (userFound, emailFound){
            if (userFound){
                next({'code': 400, 'status': 'error', 'msg': 'error.USER_EXIST'})
                throw '[Register: Username Existed] ' + username
            } else if (emailFound){
                next({'code': 400, 'status': 'error', 'msg': 'error.EMAIL_EXIST'})
                throw '[Register: Email Address Existed] ' + email
            } else {
                return '用戶名 & 電郵地址 √'
            }
        }, function (err){
            queryError(err, next)
        })
        .then(function (){
            // 獲取 國家代碼 & 城市名
            return getCountryAndCity(register_form.register_info.ip)
            .then(function (data){
                return data
            })
        })
        .spread(function (country, city){
            // 獲取 起始位置天氣 & 用戶註冊城市天氣
            return Q.all([
                    getGeoWeather(place.lat, place.lon, country),
                    getCityWeather(city, country)
                ])
            .spread(function (beginWeather, weather){
                return [country, city, beginWeather, weather]
            })
        })
        .spread(function (country, city, beginWeather, weather){
            // 獲取當前註冊用戶數
            return q_count({})
            .then(function (count){
                return [country, city, beginWeather, weather, count]
            }, function (err){
                queryError(err, next)
            })
        })
        .spread(function (country, city, beginWeather, weather, count){
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
                    'country': country,
                    'city'   : city,
                    'weather': weather
                },
                'isGeoServices': false
            })
            // 保存到數據庫
            var q_userSave = Q.nbind(user.save, user)
            q_userSave()
            .then(function (){
                res.json({'status': 'ok', 'msg': 'ok.SIGNED_UP'})
                email_helper.send_log_email(
                    'shenyepoxiao@gmail.com',
                    '新用戶加入',
                    '新用戶：' + username)
            }, function (err){
                next({'code': 500, 'status': 'error', 'msg': 'error.SERVER_ERROR'})
            })
        })
        .fail(function (err){
            console.log(err)
        })
        .done()
    },
    login: function (login_form, validator, bcrypt, jwt, key, res, next){
        // 檢查密碼是否存在
        if (!login_form.password){
            next({'code': 400, 'status': 'error', 'msg': 'error.PASSWORD_REQUIRED'})
            return;
        }
        if (validator.isEmail(login_form.user)){
            // 以電郵地址登陸
            q_login({email: validator.normalizeEmail(login_form.user)}, 
                'username password email register_info geo_info isGeoServices')
        } else {
            // 以用戶名登陸
            q_login({username: login_form.user}, 
                'username password email register_info geo_info isGeoServices')
        }
        function q_login(condition, restrict){
            q_userFindOne(condition, restrict)
            .then(function (found){
                // 檢查用戶是否存在
                if (!found){
                    next({'code': 400, 'status': 'error', 'msg': 'error.USER_NOT_EXIST'})
                    throw '[Login: User Does Not Existed] ' + login_form.user
                    return;
                }
                // 檢查密碼是否正確
                var compare_password = found.password || ''
                if (!bcrypt.compareSync(login_form.password, compare_password)){
                    next({'code': 400, 'status': 'error', 'msg': 'error.PASSWORD_INCORRECT'})
                    throw '[Login: Wrong Password] ' + login_form.user
                    return;
                }
                var token = jwt.sign({
                    'username': found.username,
                    'numero': found.register_info.numero,
                    'date': found.register_info.date,
                    'country': found.geo_info.country,
                    'weather': found.geo_info.weather,
                    'isGeoServices': found.isGeoServices
                }, key, {
                    expiresInMinutes: 60 * 24 * 7
                })
                res.json({'token': token})
            }, function (err){
                queryError(err, next)
            })
            .fail(function (err){
                console.log(err)
            })
            .done()
        }
    },
    forgot_email: function (forgot_email_form, jwt, key, res, next){

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
                next({'code': 400, 'status': 'error', 'msg': 'error.EMAIL_NOT_EXIST'})
                throw '[Forgot: Email Address Does Not Existed] ' + forgot_email_form.email
                return;
            }
            // 發送驗證碼到用戶郵箱
            email_helper.forgot_email(forgot_email_form.email, code)
            res.json({'status': 'ok', 'msg': 'ok.ENTER_CODE'})
        }, function (err){
            queryError(err, next)
        })
        .fail(function (err){
            console.log(err)
        })
        .done()
    },
    forgot_code: function (update_form, res, next){

        q_userFindOne({email: update_form.email})
        .then(function (found){
            if (!found) {
                next({'code': 400, 'status': 'error', 'msg': 'error.EMAIL_NOT_EXIST'})
                throw '[Forgot: Email Address Does Not Existed] ' + update_form.email
                return;
            }
            // 檢查驗證碼是否最新鮮，因為有可能同時存在多個新鮮的驗證碼
            if (found.forgot_code !== update_form.code){
                next({'code': 400, 'status': 'error', 'msg': 'error.CODE_LATEST'})
                throw '[Forgot: Not Fresh Code] ' + update_form.email
                return;
            }
            // 驗證碼最新鮮
            q_userFindOneAndUpdate({email: update_form.email}, {
                    'password': update_form.password,
                    'forgot_code': '',
                })
            .then(function (found){
                if(!found){
                    next({'code': 400, 'status': 'error', 'msg': 'error.EMAIL_NOT_EXIST'})
                    throw '[Forgot: Email Address Does Not Existed] ' + update_form.email
                    return;
                }
                // 發送提醒郵件
                email_helper.notify_email(update_form.email, update_form.ip)
                res.json({'status': 'ok', 'msg': 'ok.PASSWORD_CHANGED'})
            })
        }, function (err){
            queryError(err, next)
        })
        .fail(function (err){
            console.log(err)
        })
        .done()
    }
}

module.exports = db_helper