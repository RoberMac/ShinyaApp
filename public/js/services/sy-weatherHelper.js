angular.module('ShinyaApp.weatherHelperServices', [])
.service('syWeatherHelper', function(){
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
        '903': {'type': 'wind', 'icon': 'thermometer low'},
        '904': {'type': 'wind', 'icon': 'thermometer full'},
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
    }
    this.getCityWeatherType = function (code){

        if (code in weather_condition_codes){
            return weather_condition_codes[code]['type']
        } else {
            return 'others'
        }
    },
    this.getGeoWeatherType = function (code, isNight){

        if (code in weather_condition_codes){
            if (isNight){
                return weather_condition_codes[code]['icon'] + ' moon'
            } else {
                return weather_condition_codes[code]['icon'] + ' sun'
            }
        } else {
            return 'cloud refresh'
        }
    }
})