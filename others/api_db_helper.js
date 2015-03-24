var geo_helper = require('./geo_helper')

var api_db_helper = {

    getDateNews: function (user, index, User, res, next){

        User.findOne({username: user.username}, 'news', function (err, found){

            if (err){
                next({'code': 500, 'status': 'error', 'msg': '服務器出錯'})
                return err
            }
            if (!found){
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})
            } else {
                if (!!found.news[index]){
                    res.send({'status': 'ok', 'msg': found.news[index]})
                } else {
                    next({'code': 400, 'status': 'ok', 'msg': '沒有更多了'})
                }
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

        var now = new Date()
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
                        geo_helper.getDistance(found.last_geo, coords, function (data){
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