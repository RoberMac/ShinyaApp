var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

var userSchema = new Schema({
    username     : {
        type     : String,
        trim     : true,
        unique   : true,
        require  : '[username is required] :('
    },
    password     : {
        type     : String,
        select   : false,
        require  : '[Password is required] :(',
    },
    email        : {
        type     : String,
        unique   : true,
        lowercase: true,
        require  : '[Email is required] :('
    },
    register_info: {
        ip       : String,
        date     : Date,
        platform : String,
        numero   : Number
    },
    geo_info     : {
        country  : String,
        city     : String,
        weather  : Schema.Types.Mixed
    },
    forgot_code  : String,
    news         : Array,
    isGeoServices: Boolean,
    last_geo     : Schema.Types.Mixed
}),
    newsSchema = new Schema({
        date: Number,
        'BR': Schema.Types.Mixed,
        'CN': Schema.Types.Mixed,
        'DE': Schema.Types.Mixed,
        'FR': Schema.Types.Mixed,
        'HK': Schema.Types.Mixed,
        'IN': Schema.Types.Mixed,
        'JP': Schema.Types.Mixed,
        'KR': Schema.Types.Mixed,
        'RU': Schema.Types.Mixed,
        'TW': Schema.Types.Mixed,
        'US': Schema.Types.Mixed
    });

module.exports = {
    User: mongoose.model('User', userSchema),
    News: mongoose.model('News', newsSchema)
}
