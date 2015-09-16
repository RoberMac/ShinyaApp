var jwt       = require('jsonwebtoken'),
    platform  = require('platform'),
    validator = require('validator'),
    bcrypt    = require('bcrypt'),
    router    = require('express').Router(),
    db_helper = require('../others/db_helper');


router.get(['/', '/chat', '/forgot'], function (req, res, next){

    platform.parse(req.get('user-agent')).name === 'IE'
    ? res.redirect(process.env.PWD + '/views/404.html')
    : res.sendFile(process.env.PWD + '/views/index.html')
})

router.post('/register', function (req, res, next){

    // 用戶註冊信息
    var register_form = {
        username      : validator.trim(req.body.username),
        password      : bcrypt.hashSync(req.body.password, 12),
        email         : req.body.email,
        register_info : {
            ip        : req.ip,
            date      : new Date(),
            platform  : platform.parse(req.get('user-agent')).description
        }
    }
    db_helper.register(register_form, validator, res, next)
})

router.post('/login', function (req, res, next){

    // 用戶登陸信息
    var login_form = {
        user     : validator.trim(req.body.user),
        password : req.body.password
    }
    db_helper.login(login_form, validator, bcrypt, jwt, key, res, next)
})

router.post('/forgot_email', function (req, res, next){

    // 電郵地址信息
    var forgot_email_form = {
        email: req.body.email,
    }
    db_helper.forgot_email(forgot_email_form, jwt, key, res, next)

})

router.post('/forgot_code', function (req, res, next){

    if (!req.body.password){
        next({'code': 400, 'status': 'error', 'msg': 'error.NEW_PASSWORD'})
        return;
    } else if (!req.body.code) {
        next({'code': 400, 'status': 'error', 'msg': 'error.ENTER_CODE'})
        return;
    }
    // 電郵地址信息
    var forgot_code_form = {
        code: req.body.code,
        password: bcrypt.hashSync(req.body.password, 12)
    }
    jwt.verify(forgot_code_form.code, key, function (err, decode){
        
        if (err) {
            if (err.name === 'TokenExpiredError'){
                res.status(400).json({'status': 'error', 'msg': 'error.CODE_EXPIRED'})
            } else if (err.name === 'JsonWebTokenError'){
                res.status(400).json({'status': 'error', 'msg': 'error.CODE_ERROR'})
            } else {
                res.status(400).json({'status': 'error', 'msg': 'error.CODE_WHAT'})
            }
            return;
        }
        var update_form = {
            email: decode.email,
            code: forgot_code_form.code,
            password: forgot_code_form.password,
            ip: req.ip
        }
        db_helper.forgot_code(update_form, res, next)
    })
})

module.exports = router