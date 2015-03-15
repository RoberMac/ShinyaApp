var maxmind   = require('maxmind'),
    validator = require('validator');

// init
maxmind.init('./others/GeoIP.dat')
maxmind.init('./others/GeoIPv6.dat')

function getGeo(ip){

    if (validator.isIP(ip, 4)){
        console.log(maxmind.getCountry(ip))
        return maxmind.getCountry(ip)
    } else if (validator.isIP(ip, 6)){
        console.log(maxmind.getCountryV6(ip))
        return maxmind.getCountryV6(ip)
    } else {
        console.log('wrong ip')
        return null
    }
}

module.exports = getGeo