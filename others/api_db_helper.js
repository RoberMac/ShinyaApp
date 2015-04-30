var geo_helper = require('./geo_helper')

// Q
var q_userFindOne          = Q.nbind(User.findOne, User),
    q_userFindOneAndUpdate = Q.nbind(User.findOneAndUpdate, User),
    q_newsFindOne          = Q.nbind(News.findOne, News);

// Helper
function queryError(err, next){
    log.error('[DB: Query Error]', err)
    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
    throw new Error('Query Error')
}

var api_db_helper = {

    // 獲取其他用戶基本信息
    getUserInfo: function (username, res, next){

        q_userFindOne({username: username}, 'register_info geo_info')
        .then(function (userInfo){
            if (!userInfo){
                log.warning('[DB: Not Found]')
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                return;
            }
            var basic_info = {
                numero : userInfo.register_info.numero,
                country: userInfo.geo_info.country,
                date   : geo_helper.getDayMs(userInfo.register_info.date),
            }
            res.send({'status': 'ok', 'msg': basic_info})
        }, function (err){
            queryError(err, next)
        })
    },
    // 獲取選定時段新聞
    getSelectedDateNews: function (user, body, res, next){

        q_userFindOne({username: user.username}, 'register_info geo_info')
        .then(function (userInfo){
            if (!userInfo){
                log.warning('[DB: Not Found]')
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                return;
            }
            var country    = body.selectCountry,
                userDate   = body.isTodayNews ? new Date() : userInfo.register_info.date,
                selectDate = body.selectDate + body.timezoneOffset,
                selectDate = Date.UTC(
                    userDate.getUTCFullYear(),
                    userDate.getUTCMonth(),
                    userDate.getUTCDate(),
                    selectDate
                );
            /**
             *
             * 新聞來源指向：
             * 新加坡、馬來西亞 -> 台灣
             * 澳門 -> 香港
             * 其他(加拿大、英國、...) -> 美國
             *
            **/
            var country_list = ['BR', 'CN', 'DE', 'FR', 'HK', 'IN', 'JP', 'KR', 'RU', 'TW', 'US']
            if (country === 'MO'){
                country = 'HK'
            } else if (country === 'SG' || country === 'MY'){
                country = 'TW'
            } else if (country_list.indexOf(country) < 0){
                country = 'US'
            }
            q_newsFindOne({date: selectDate}, country)
            .then(function (found){
                if (!found){
                    log.warning('[DB: Not Found]', selectDate, country)
                    res.status(400).json({'status': 'error', 'msg': '此時段新聞不存在'})
                    return;
                }
                res.send({'status': 'ok', 'msg': found[country]})
            }, function (err){
                queryError(err, next)
            })
        }, function (err){
            queryError(err, next)
        })
    },
    // 開啟／關閉「位置服務」
    toggleGeoServices: function (user, body, res, next){

        q_userFindOneAndUpdate({username: user.username}, {
            isGeoServices: body.isGeoServices
        })
        .then(function (){
            res.send({'status': 'ok', 'msg': body.isGeoServices ? 'on' : 'off'})
        }, function (err){
            queryError(err, next)
        })
    },
    // 獲取「位置服務」
    getGeoServices: function (user, coords, res, next){

        q_userFindOne({username: user.username}, 'last_geo')
        .then(function (found){
            if (!found){
                log.warning('[DB: Not Found]')
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
                return;
            }
            if (geo_helper.isSamePlace(found.last_geo, coords) 
                && (new Date() - geo_helper.getDayMs(found.last_geo.date)) < 86400000){
                // 同一天同一位置多次請求
                var msg = {
                    last_geo: found.last_geo,
                    now_geo : {
                        lat: coords.lat,
                        lon: coords.lon,
                        location: found.last_geo.location,
                        date: new Date(),
                        weather: found.last_geo.weather
                    }
                }
                // 更新座標、日期
                q_userFindOneAndUpdate({username: user.username}, {
                    last_geo: msg.now_geo
                })
                .then(function (found){
                    res.send({'status': 'ok', 'msg': msg})
                }, function (err){
                    queryError(err, next)
                })
            } else {
                // 獲取 天氣 & 街道名
                Q.all([
                    geo_helper.getGeoWeather(coords.lat, coords.lon),
                    geo_helper.getStreetName(coords)
                    ])
                .spread(function (weather, streetName){
                    // 距離服務
                    var msg = {
                        last_geo: found.last_geo,
                        now_geo : {
                            lat: coords.lat,
                            lon: coords.lon,
                            location: streetName,
                            date: new Date(),
                            weather: weather
                        }
                    }
                    // 更新座標、街道名、日期、天氣
                    q_userFindOneAndUpdate({username: user.username}, {
                        last_geo: msg.now_geo
                    })
                    .then(function (found){
                        res.send({'status': 'ok', 'msg': msg})
                    }, function (err){
                        queryError(err, next)
                    })
                })
            }
        }, function (err){
            queryError(err, next)
        })
    }
}

module.exports = api_db_helper