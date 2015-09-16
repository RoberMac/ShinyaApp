//local variables
var express    = require('express'),
    fs         = require('fs'),
    app        = express(),
    logger     = require('morgan'),
    res_time   = require('response-time'),
    favicon    = require('serve-favicon'),
    bodyParser = require('body-parser'),
    http       = require('http').Server(app),
    mongoose   = require('mongoose'),
    helmet     = require('helmet'),
    compress   = require('compression');

// load dotenv
require('dotenv').load()

// global variables
global.Q    = require('q')
global.io   = require('socket.io')(http)
global.User = require('./models/db').User
global.News = require('./models/db').News
global.key  = process.env.KEY || fs.readFileSync(__dirname + '/others/jwt.key')

// read database config form VCAP_SERVICES env
var db_uri = process.env.MONGODB 
    ? JSON.parse(process.env.MONGODB).uri
    : 'mongodb://test:test@localhost:27017/test'

// Connect to DB
mongoose.connect(db_uri);

var db = mongoose.connection
.on('err', function (err){
    console.log(err)
})
.once('open', function (){
    console.log('[DB]', 'Connected to MongoDB')
})

// Socket.IO Server Side
var io_helper = require('./others/io_helper')

// App Settings
// app.set('x-powered-by', false)
app.set('trust proxy', true)

// Middleware
app.use(compress())
app.use(logger(':remote-addr [:date[clf]] :method :url'))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(res_time())
app.use(favicon(__dirname + '/public/img/favicon.ico'))
app.use(helmet())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
app.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    // scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    // styleSrc: ["'self'", "http://*.qbox.me.com"],
    imgSrc: ["*"],
    connectSrc: ['*'],
    reportOnly: false, // set to true if you only want to report errors
    setAllHeaders: false, // set to true if you want to set all headers
    disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy)
    safari5: false // set to true if you want to force buggy CSP in Safari 5
}));

// Routing
var index = require('./routes/index')
app.use('/', index)
app.use('/public', express.static('public'))
var api   = require('./routes/api')
app.use('/api', api)


// Handing Error
app.use(function (req, res){
    res.status('404').sendFile(process.env.PWD + '/views/404.html')
})
app.use(function (err, req, res, next){
    console.log(err, err.stack)

    var statusCode = err.code || err.status;

    switch (statusCode){
        case 400:
            res.status(statusCode).json({'status': 'error', 'msg': err.msg})
            break;
        case 401:
            res.status(statusCode).json({'status': 'error','msg': err.message})
            break;
        case 500:
            res.status(statusCode).json({'status': 'error', 'msg': err.msg})
            break;
        default:
            res.status(500).json({'status': 'error', 'msg': 'server error'})

    }
})

http.listen(process.env.PORT || 3000, function (){
    console.log('[Listen]', '3000 port')
})