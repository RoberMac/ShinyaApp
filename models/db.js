var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

// mongoose.connect('mongodb://localhost/test')
// var db = mongoose.connection.
// on('error', console.error.bind(console, 'connection error')).
// once('open', function (callback) {
//   console.log('[Connected to MongoDB]')
// });

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
        platform : String
    },
    other_info   : {
        numero   : Number,
        geo      : Schema.Types.Mixed
    },
    forgot_code  : String,
    news         : Array
})

var User = mongoose.model('User', userSchema)
// User.schema.path('password', Number)
// User.schema.path('username').validate(function (value){
//     return value == 'RoberMac' ? true : false
// })

module.exports.User = User
