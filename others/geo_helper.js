var maxmind   = require('maxmind'),
    validator = require('validator'),
    distance  = require('google-distance'),
    API_KEY   = 'AIzaSyA894nYOdT_qk9_gEXZtNUeHpyJLn-MFs0',
    geocoder  = require('node-geocoder')('google', 'https', {
        apiKey: API_KEY,
        language: 'zh-HK'
    });

// init
maxmind.init('./others/GeoIP.dat')
maxmind.init('./others/GeoIPv6.dat')


var geo_helper = {

    getCountry: function (ip){
        if (validator.isIP(ip, 4)){
            return maxmind.getCountry(ip)
        } else if (validator.isIP(ip, 6)){
            return maxmind.getCountryV6(ip)
        } else {
            return null
        }
    },
    getStreetName: function (origin, callback){
        geocoder.reverse({
            lat: origin.lat, 
            lon: origin.lon
        }, function (err, data){
            if (err){
                callback({
                    streetName: '...'
                })
                return err
            }
            console.log(data[0])
            callback(data[0].streetName)
        });
    },
    getDistance: function (origin, destination, callback){
        distance.get({
            origin: origin.lat + ', ' + origin.lon,
            destination: destination.lat + ', ' + destination.lon
        }, function (err, data){
            if (err) {
                callback({
                    distance: null,
                    location: null,
                    destination: '加利福尼亞'
                })
                return err
            }
            callback(data)
        })
    },
    // initCoords: function (country){
    //     var coords = {
    //         'CN': '30.254258, 120.163803',
    //         'HK': '22.231148, 114.251095',
    //         'TW': '25.049465, 121.542131',
    //         'US': '37.340193, -122.068768',
    //         'BR': '-22.911926, -43.230145',
    //         'JP': '35.693433, 139.699471',
    //         'FR': '43.701732, 7.300161',
    //         'KR': '',
    //         'RU': ''
    //     }
    // },
    getWeather: function (lat, lon, callback){
        // Yahoo
    },
    isSamePlace: function (last, now){

        return Math.abs(last.lat - now.lat) > 0.001
        || Math.abs(last.lon - now.lon) > 0.001
        ? false
        : true
    }
}


module.exports = geo_helper