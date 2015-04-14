var geo_helper = require('./geo_helper')

var api_db_helper = {

    getTodayMs: geo_helper.getTodayMs,
    // 獲取選定時段新聞
    getSelectedDateNews: function (user, body, User, res, next){

        User.findOne({username: user.username}, 'register_info geo_info', function (err, userInfo){

            if (err){
                log.error('[DB: Query Error]', err)
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            if (!userInfo){
                log.warning('[DB: Not Found]')
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
            } else {
                var country    = userInfo.geo_info.country,
                    userDate   = userInfo.register_info.date,
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
                News.findOne({date: selectDate}, country, function (err, found){

                    if (err){
                        log.error('[DB: Query Error]', err)
                        next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                        return err
                    }
                    if (!found){
                        log.warning('[DB: Not Found]', selectDate, country)
                        res.status(400).json({'status': 'error', 'msg': '此時段新聞不存在'})
                    } else {
                        log.info('[DB: Found]', selectDate)
                        res.send({'status': 'ok', 'msg': found[country]})
                    }
                })
            }
        })
    },
    // 開啟／關閉「位置服務」
    toggleGeoServices: function (user, body, User, res, next){

        User.findOneAndUpdate({username: user.username}, {
            isGeoServices: body.isGeoServices
        }, function (err){

            if (err){
                log.error('[DB: Query Error]', err)
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            log.info('[DB: Found]')
            res.send({'status': 'ok', 'msg': body.isGeoServices ? 'on' : 'off'})
        })
    },
    // 獲取「位置服務」
    getGeoServices: function (user, coords, User, res, next){

        User.findOne({username: user.username}, 'last_geo', function (err, found){

            if (err){
                log.error('[DB: Query Error]', err)
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            if (!found){
                log.warning('[DB: Not Found]')
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
            } else {
                if (geo_helper.isSamePlace(found.last_geo, coords) && (new Date() - geo_helper.getTodayMs(found.last_geo.date)) < 86400000){
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
                    User.findOneAndUpdate({username: user.username}, {
                        last_geo: msg.now_geo
                    }, function (err, found){
                        if (err){
                            log.error('[DB: Query Error]', err)
                            next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                            return err
                        }
                        log.info('[DB: Found]')
                        res.send({'status': 'ok', 'msg': msg})
                    })
                } else {
                    geo_helper.getGeoWeather(coords.lat, coords.lon, function (weather){
                        geo_helper.getStreetName(coords, function (streetName){
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
                            User.findOneAndUpdate({username: user.username}, {
                                last_geo: msg.now_geo
                            }, function (err, found){
                                if (err){
                                    log.error('[DB: Query Error]', err)
                                    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                    return err
                                }
                                log.info('[DB: Found]')
                                res.send({'status': 'ok', 'msg': msg})
                            })
                        })
                    })
                }
            }
        })
    }
}

module.exports = api_db_helper