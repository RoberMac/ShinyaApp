var validator = require('validator'),
    sjwt      = require('socketio-jwt');

io.use(sjwt.authorize({
    secret: key,
    handshake: true
}))

var msgCache   = [],
    onlineUser = [],
    multiLoginUser = [],
    userCount  = 0;
io.on('connection', function (socket) {
    var username =  socket.decoded_token.username
    log.info('[SIO: Connect]', username, socket.id, userCount)
    if (onlineUser.indexOf(username) < 0){
        userCount ++
        onlineUser.push(username)
    } else {
        multiLoginUser.push(username)
    }
    io.emit('userJoin', {
        'count' : userCount,
        'onlineUser': onlineUser
    })

    socket.on('latestMsg', function (msg){
        if (msg === true){
            io.sockets.connected[socket.id].emit('latestMsg', msgCache)            
        }
    })

    // socket.join(socket.id) 
    // socket.on('room', function (roomNum){
    //     io.to(socket.id).emit('room', socket.id)
    // })
    socket.on('textMsg', function (msg) {

        // 提取文本中的 URL
        var url_list = msg.msg.match(/(https?:\/\/[^\s]+)/g),
            img_list  = [];
        // 提取 URL 中的 Image URL
        if (url_list){
            for (var i = 0; i < url_list.length; i++){
                var url = url_list[i]
                if (validator.isURL(url) && /\.(jpe?g|png|gif)$/i.test(url)){
                    img_list.push(url)
                }
            }
        }
        // 初始化消息對象
        var newMsg = {
                'id'      : socket.id,
                'date'    : Date.now(),
                'msg'     : msg.msg,
                'username': username,
                'at'      : msg.at,
                'img_list': img_list
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
        log.info('[SIO: Disconnect]', username, userCount)
        if (onlineUser.indexOf(username) >= 0){
            if (multiLoginUser.indexOf(username) >= 0){
                multiLoginUser.splice(onlineUser.indexOf(username), 1)
            } else {
                userCount --
                onlineUser.splice(onlineUser.indexOf(username), 1)
            }
        }
        io.emit('disconnect', {
            'count' : userCount,
            'onlineUser': onlineUser
        })
    })
})

module.exports = io