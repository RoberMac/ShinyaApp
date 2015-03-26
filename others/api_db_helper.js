var geo_helper = require('./geo_helper')

var api_db_helper = {

    getSelectedDateNews: function (user, body, User, res, next){

        User.findOne({username: user.username}, 'register_info geo_info', function (err, userInfo){

            if (err){
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            if (!userInfo){
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
            } else {
                var country    = userInfo.geo_info.country,
                    userDate   = userInfo.register_info.date,
                    selectDate = body.selectDate + body.timezoneOffset,
                    selectDate = Date.parse(
                        new Date(
                            userDate.getUTCFullYear(),
                            userDate.getUTCMonth(),
                            userDate.getUTCDate(),
                            selectDate
                        )
                    );
                console.log(body.selectDate, body.timezoneOffset, body.selectDate + body.timezoneOffset)
                /**
                 *
                 * 新聞來源指向：
                 * 新加坡、馬來西亞 -> 台灣
                 * 澳門 -> 香港
                 * 加拿大、英國、其他 -> 美國
                 *
                **/
                // if (country === 'MO'){
                //     country = 'HK'
                // } else if (country === 'SG' || country === 'MY'){
                //     country = 'TW'
                // } else if (!(country in )){
                //     country = 'US'
                // }
                News.findOne({date: selectDate}, 'HK', function (err, found){

                    if (err){
                        console.log(err)
                        next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                        return err
                    }
                    if (!found){
                        res.status(400).json({'status': 'error', 'msg': '此時段新聞不存在'})
                    } else {
                        res.send({'status': 'ok', 'msg': found['HK']})
                    }
                })
            }
        })
    },
    turnOnGeoServices: function (user, User, res, next){

        User.findOneAndUpdate({username: user.username}, {isGeoServices: true}, function (err){

            if (err){
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            res.send({'status': 'ok', 'msg': '已開啟位置服務，請重新登錄'})
        })
    },
    turnOffGeoServices: function (user, User, res, next){

        User.findOneAndUpdate({username: user.username}, {isGeoServices: false}, function (err){

            if (err){
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            res.send({'status': 'ok', 'msg': '已關閉位置服務，請重新登錄'})
        })
    },
    getGeoServices: function (user, coords, User, res, next){

        User.findOne({username: user.username}, 'last_geo', function (err, found){

            if (err){
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            if (!found){
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
            } else {
                // 同一位置多次請求
                if (geo_helper.isSamePlace(found.last_geo, coords)){
                    console.log('same place')
                    var msg = {
                        distance: '0 km',
                        last_geo: found.last_geo,
                        now_geo : {
                            lat: coords.lat,
                            lon: coords.lon,
                            location: found.last_geo.location
                        }
                    }
                    res.send({'status': 'ok', 'msg': msg})
                } else {
                    geo_helper.getStreetName(coords, function (streetName){
                        console.log(streetName)
                        geo_helper.getDistance(found.last_geo, coords, function (data){
                            console.log(data)
                            // 距離服務
                            var msg = {
                                distance: !!data.distance ? data.distance : '+∞ km',
                                last_geo: found.last_geo,
                                now_geo : {
                                    lat: coords.lat,
                                    lon: coords.lon,
                                    location: streetName
                                }
                            }
                            // 更新座標
                            User.findOneAndUpdate({username: user.username}, {
                                last_geo: msg.now_geo
                            }, function (err, found){
                                if (err){
                                    next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                                    return err
                                }
                                res.send({'status': 'ok', 'msg': msg})
                            })
                            // 天氣服務
                        })
                    })
                }
            }
        })
    }
}

module.exports = api_db_helper