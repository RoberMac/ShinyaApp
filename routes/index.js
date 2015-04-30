var jwt       = require('jsonwebtoken'),
    platform  = require('platform'),
    validator = require('validator'),
    bcrypt    = require('bcrypt'),
    router    = require('express').Router(),
    db_helper = require('../others/db_helper');


router.get(['/', '/chat', '/forgot'], function (req, res, next){

    log.info('[GET: /]', req.ip)

    platform.parse(req.get('user-agent')).name === 'IE'
    ? res.redirect('//browsehappy.com')
    : res.sendFile('/vagrant/ShinyaApp/views/index.html')
})


router.post('/register', function (req, res, next){

    log.info('[POST: /register]', req.ip, req.body.username)
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

    log.info('[POST: /login]', req.ip, req.body.user)
    // 用戶登陸信息
    var login_form = {
        user     : validator.trim(req.body.user),
        password : req.body.password
    }
    db_helper.login(login_form, validator, bcrypt, jwt, key, res, next)
})

router.post('/forgot_email', function (req, res, next){

    log.info('[POST: /forgot_email]', req.ip)
    // 電郵地址信息
    var forgot_email_form = {
        email: req.body.email,
    }
    db_helper.forgot_email(forgot_email_form, jwt, key, res, next)

})

router.post('/forgot_code', function (req, res, next){

    log.info('[POST: /forgot_code]', req.ip)
    if (!req.body.password){
        log.warning('[Forgot: Required Password]')
        next({'code': 400, 'status': 'error', 'msg': '請填寫新密碼'})
        return;
    } else if (!req.body.code) {
        log.warning('[Forgot: Required Code]')
        next({'code': 400, 'status': 'error', 'msg': '請填寫驗證碼'})
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
                log.warning('[Forgot: Code Expires]', err)
                res.status(400).json({'status': 'error', 'msg': '驗證碼已經過期了'})
            } else if (err.name === 'JsonWebTokenError'){
                log.warning('[Forgot: Wrong Code]', err)
                res.status(400).json({'status': 'error', 'msg': '這個碼不是我發的'})
            } else {
                log.warning('[Forgot: WTF]', err)
                res.status(400).json({'status': 'error', 'msg': '我不知道你說什麼'})
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