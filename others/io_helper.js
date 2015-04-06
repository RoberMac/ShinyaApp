var fs   = require('fs'),
    sjwt = require('socketio-jwt');

// io.use(function (a, b){
//     a.my_token = key;
//     b();
// })

io.use(sjwt.authorize({
    secret: key,
    handshake: true
}))

var msgCache   = [],
    onlineUser = [],
    userCount  = 0;
io.on('connection', function (socket) {

    log.info('[SIO: Connect]', socket.decoded_token.username, socket.id, userCount)
    userCount ++
    onlineUser.push(socket.decoded_token.username)
    io.emit('userJoin', {
        'count' : userCount,
        'onlineUser': onlineUser
    })

    log.info('[SIO: latestMsg]', socket.decoded_token.username)
    socket.on('latestMsg', function (msg){
        if (msg === true){
            io.sockets.connected[socket.id].emit('latestMsg', msgCache)            
        }
    })

    // socket.join(socket.id) 
    // socket.on('room', function (roomNum){
    //     io.to(socket.id).emit('room', socket.id)
    // })
    // socket.on('add username', function (msg){
    //     io.emit('add username', msg)
    //     console.log('add username: ' + msg)
    // })
    socket.on('textMsg', function (msg) {

        var newMsg = {
                'id'      : socket.id,
                'date'    : Date.now(),
                'msg'     : msg.msg,
                'username': socket.decoded_token.username,
                'at'      : msg.at
            }
        // 緩存十條消息
        if (msgCache.length < 10){
            msgCache.push(newMsg)
        } else {
            msgCache.shift()
            msgCache.push(newMsg)
        }
        io.emit('textMsg', newMsg)
    })
    socket.on('disconnect', function (msg) {
        log.info('[SIO: Disconnect]', socket.decoded_token.username, userCount)
        userCount --
        onlineUser.splice(onlineUser.indexOf(socket.decoded_token.username), 1)
        io.emit('disconnect', {
            'count' : userCount,
            'onlineUser': onlineUser
        })
    })
})

module.exports = io