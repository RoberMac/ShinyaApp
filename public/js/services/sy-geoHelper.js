angular.module('ShinyaApp.geoHelperServices', [])
.service('syGeoHelper', function(){
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    function distanceHelper(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }
    var weather_condition_codes = {
        // http://openweathermap.org/weather-conditions
        // Thunderstorm 200 ~ 232
        '200': {'type': 'lightning', 'icon': 'lightning'},
        '201': {'type': 'lightning', 'icon': 'lightning'},
        '202': {'type': 'lightning', 'icon': 'lightning'},
        '210': {'type': 'lightning', 'icon': 'lightning'},
        '211': {'type': 'lightning', 'icon': 'lightning'},
        '212': {'type': 'lightning', 'icon': 'lightning'},
        '221': {'type': 'lightning', 'icon': 'lightning'},
        '230': {'type': 'lightning', 'icon': 'lightning'},
        '231': {'type': 'lightning', 'icon': 'lightning'},
        '232': {'type': 'lightning', 'icon': 'lightning'},
        // Drizzle 300 ~ 321
        '300': {'type': 'rain', 'icon': 'drizzle'},
        '301': {'type': 'rain', 'icon': 'drizzle'},
        '302': {'type': 'rain', 'icon': 'drizzle'},
        '310': {'type': 'rain', 'icon': 'drizzle'},
        '311': {'type': 'rain', 'icon': 'drizzle'},
        '313': {'type': 'rain', 'icon': 'showers'},
        '314': {'type': 'rain', 'icon': 'showers'},
        '321': {'type': 'rain', 'icon': 'showers'},
        // Rain 500 ~ 531
        '500': {'type': 'rain', 'icon': 'rain'},
        '501': {'type': 'rain', 'icon': 'rain'},
        '502': {'type': 'rain', 'icon': 'downpour'},
        '503': {'type': 'rain', 'icon': 'downpour'},
        '504': {'type': 'rain', 'icon': 'downpour'},
        '511': {'type': 'rain', 'icon': 'flurries'},
        '520': {'type': 'rain', 'icon': 'showers'},
        '521': {'type': 'rain', 'icon': 'showers'},
        '522': {'type': 'rain', 'icon': 'showers'},
        '531': {'type': 'rain', 'icon': 'showers'},
        // Snow 600 ~ 622
        '600': {'type': 'snow', 'icon': 'snow'},
        '601': {'type': 'snow', 'icon': 'snow'},
        '602': {'type': 'snow', 'icon': 'snow'},
        '611': {'type': 'snow', 'icon': 'sleet'},
        '612': {'type': 'snow', 'icon': 'sleet'},
        '615': {'type': 'snow', 'icon': 'sleet'},
        '616': {'type': 'snow', 'icon': 'sleet'},
        '620': {'type': 'snow', 'icon': 'sleet'},
        '621': {'type': 'snow', 'icon': 'sleet'},
        '622': {'type': 'snow', 'icon': 'sleet'},
        // Atmosphere 701 ~ 781
        '701': {'type': 'fog', 'icon': 'fog'},
        '711': {'type': 'fog', 'icon': 'haze'},
        '721': {'type': 'fog', 'icon': 'haze'},
        '731': {'type': 'fog', 'icon': 'haze'},
        '741': {'type': 'fog', 'icon': 'fog'},
        '751': {'type': 'fog', 'icon': 'fog'},
        '761': {'type': 'fog', 'icon': 'fog'},
        '771': {'type': 'fog', 'icon': 'tornado'},
        '781': {'type': 'fog', 'icon': 'tornado'},
        // Sun & Clouds 800, 904
        '800': {'type': 'sun', 'icon': 'sun'},
        '801': {'type': 'sun', 'icon': 'sun'},
        '802': {'type': 'clouds', 'icon': 'cloud'},
        '803': {'type': 'clouds', 'icon': 'cloud'},
        '804': {'type': 'clouds', 'icon': 'cloud'},
        // Extreme
        '900': {'type': 'wind', 'icon': 'tornado'},
        '901': {'type': 'wind', 'icon': 'tornado'},
        '902': {'type': 'wind', 'icon': 'tornado'},
        '903': {'type': 'wind', 'icon': 'thermometer-low'},
        '904': {'type': 'wind', 'icon': 'thermometer-full'},
        '905': {'type': 'wind', 'icon': 'wind'},
        '906': {'type': 'wind', 'icon': 'hail'},
        // Additional
        '951': {'type': 'wind', 'icon': 'wind'},
        '952': {'type': 'wind', 'icon': 'wind'},
        '953': {'type': 'wind', 'icon': 'wind'},
        '954': {'type': 'wind', 'icon': 'wind'},
        '955': {'type': 'wind', 'icon': 'wind'},
        '956': {'type': 'wind', 'icon': 'tornado'},
        '957': {'type': 'wind', 'icon': 'tornado'},
        '958': {'type': 'wind', 'icon': 'tornado'},
        '959': {'type': 'wind', 'icon': 'tornado'},
        '960': {'type': 'wind', 'icon': 'tornado'},
        '961': {'type': 'wind', 'icon': 'tornado'},
        '962': {'type': 'wind', 'icon': 'tornado'}
    },
        flat_list = ['sun', 'wind', 'thermometer-full', 'thermometer-low', 'tornado'];

    this.getCityWeatherType = function (code){

        if (code in weather_condition_codes){
            return weather_condition_codes[code]['type']
        } else {
            return 'others'
        }
    },
    this.getGeoWeatherType = function (code, isNight){

        var icon = weather_condition_codes[code]['icon']
        if (flat_list.indexOf(icon) < 0){
            if (code in weather_condition_codes){
                if (isNight){
                    return icon + '-moon'
                } else {
                    return icon + '-sun'
                }
            }
        } else {
            return icon
        }
    },
    this.getDistance = function (origin, destination){

        var distance = ~~distanceHelper(origin.lat, origin.lon, destination.lat, destination.lon, 'K')
        return !!distance ? distance + ' km' : '0 km'
    }
})