//local variables
var express    = require('express'),
    app        = express(),
    logger     = require('morgan'),
    res_time   = require('response-time'),
    favicon    = require('serve-favicon'),
    bodyParser = require('body-parser'),
    http       = require('http').Server(app),
    mongoose   = require('mongoose'),
    helmet     = require('helmet');

// global variables
global.io    = require('socket.io')(http),
global.User  = require('./models/db').User,
global.News  = require('./models/db').News
global.key   = require('fs').readFileSync(__dirname + '/public/others/public_key.pem')

// init
app.set('DB', {
    username: 'RoberMac',
    password: '86916610'
})

// Connect to DB
mongoose.connect('mongodb://localhost/test', {
    user: app.get('DB').username,
    pass: app.get('DB').password
});

var db = mongoose.connection
.on('err', function (err){
    console.log(err)
})
.once('open', function (){
    console.log('[Connected to MongoDB: RoberMac]')
})

// Socket.IO Server Side
var io_helper = require('./others/io_helper')

// App Settings
// app.set('x-powered-by', false)
app.set('trust proxy', true)

// Middleware
app.use(logger('combined'))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(res_time())
app.use(favicon(__dirname + '/public/img/favicon.ico'))
// app.use(function (req, res, next){
//     res.set({
//         "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src *",
//         "Access-Control-Allow-Origin": "*:"
//     })
//     next()
// })
app.use(helmet())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
app.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    // scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    // styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    connectSrc: ['*'],
    reportOnly: false, // set to true if you only want to report errors
    setAllHeaders: false, // set to true if you want to set all headers
    disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy)
    safari5: false // set to true if you want to force buggy CSP in Safari 5
}));

// Routing
var index = require('./routes/index')
app.use('/', index)
var api   = require('./routes/api')
app.use('/api', api)


// Handing 404   
app.use(function (req, res){
    console.log('[404 Error]')
    res.status('404').sendFile(__dirname + '/views/404.html')
})

// Handing 400
app.use(function (err, req, res, next){
    if (err.code === 400){
        console.log('[400 Error]:' + err)
        res.status(400).json({'status': 'error', 'msg': err.msg})
    } else {
        next(err)        
    }
})

// Handing 500
app.use(function (err, req, res, next){
    if (err.code === 500){
        console.log('[500 Error]:' + err)
        res.status(500).json({'status': 'error', 'msg': err.msg})
    } else {
        next(err)
    }
})

// Handing 401
app.use(function (err, req, res, next){
    for (var i in err){
        console.log('[401 Error]:' + err)        
    }
    if (err.status === 401){
        res.status(401).json({'status': 'error','msg': err.message})  
    } else {
        next(err)
    }
})

// 定時抓取新聞
var getNews = require('./others/rss_helper');
getNews(1000 * 60 * 60 * 1)


http.listen('3000', function (){
    console.log('listening 3000 port')
})