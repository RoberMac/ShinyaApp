var fs   = require('fs'),
    sjwt = require('socketio-jwt');

var key = fs.readFileSync('public/others/public_key.pem');
// io.use(function (a, b){
//     a.my_token = key;
//     b();
// })
io.use(sjwt.authorize({
    secret: key,
    handshake: true
}))

io.on('connection', function (socket) {

    // socket.on('message', function (mes){
    //     console.log(mes + 'is in.');
    //     io.emit('message', socket.id)
    // })
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
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg)
        console.log('chat message: ' + msg.msg + ', id: ' + msg.id)
    })
    // socket.on('disconnect', function (msg) {
    //     io.emit('disconnect', msg)
    //     console.log('disconnect: ' + msg)
    // })
})

module.exports = io