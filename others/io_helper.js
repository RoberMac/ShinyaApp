var fs   = require('fs'),
    sjwt = require('socketio-jwt');

var key       = fs.readFileSync('public/others/public_key.pem')
// io.use(function (a, b){
//     a.my_token = key;
//     b();
// })

io.use(sjwt.authorize({
    secret: key,
    handshake: true
}))

var msgCache  = [],
    userCount = 0;
io.on('connection', function (socket) {

    userCount ++
    io.emit('userJoin', userCount)

    socket.on('latestMsg', function (msg){
        if (msg === true){
            io.sockets.connected[socket.id].emit('latestMsg', msgCache)            
        } else {
            console.log('nothing need to do')
        }
    })

    console.log('socket.decoded_token: ', socket.decoded_token);
    console.log('socket.id: ' + socket.id)

    // socket.join(socket.id) 
    // socket.on('room', function (roomNum){
    //     io.to(socket.id).emit('room', socket.id)
    // })
    // socket.on('add username', function (msg){
    //     io.emit('add username', msg)
    //     console.log('add username: ' + msg)
    // })
    socket.on('textMsg', function (msg) {
        // 緩存十條消息
        if (msgCache.length < 10){
            msgCache.push({
                'isMe'    : false,
                'msg'     : msg.msg,
                'username': socket.decoded_token.username
            })
        } else {
            msgCache.shift()
            msgCache.push({
                'isMe'      : false,
                'msg'     : msg.msg,
                'username': socket.decoded_token.username
            })
        }
        io.emit('textMsg', msg)
        console.log('textMsg: ' + msg.msg + ', id: ' + msg.id)
    })
    socket.on('disconnect', function (msg) {
        userCount --
        io.emit('disconnect', userCount)
        console.log(socket.decoded_token.username + 'quit')
    })
})

module.exports = io