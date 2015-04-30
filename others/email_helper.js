var nodemailer = require('nodemailer'),
    Q          = require('q');

var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
        'user': process.env.YAHOO_USER || '',
        'pass': process.env.YAHOO_PWD || ''
    }
})

// Q
var q_sendMail = Q.nbind(transporter.sendMail, transporter)

var email_helper = {

    forgot_email: function (email, code){

        var mailOptions = {
            from: '深夜，破曉 <shenyepoxiao@yahoo.com>',
            to: email,
            subject: '尋找你的帳戶',
            html: '<div style=\'white-space: pre-wrap; word-break: break-all; margin: 0 auto; width: 300px;'
                    + 'font-family: "Helvetica Neue","Palatino","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;\'>'
                    + '<h3 style=\'letter-spacing: 3px; font-size: 16px; text-align: center;\'>驗證碼</h3>'
                    + '<p style=\'font-size:11px; text-align: center; color: #555;\'>'
                    + code + 
                    '</p><p style=\'font-size: 12px; text-align: center; color:#CECECF;\'>請在 60 分鐘內驗證</p><div>'
        }
        q_sendMail(mailOptions)
        .then(function (info){
            log.info('[Forgot: Send Forgot Mail Success]', info.response)
        }, function (err){
            log.error('[Forgot: Send Forgot Mail Wrong]', err)
        })
    },
    notify_email: function (email, ip){

        var mailOptions = {
            from: '深夜，破曉 <shenyepoxiao@yahoo.com>',
            to: email,
            subject: '密碼修改成功',
            html: '<div style=\'white-space: pre-wrap; word-break: break-all; margin: 0 auto; width: 300px;'
                    + 'font-family: "Helvetica Neue","Palatino","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;\'>'
                    + '<h3 style=\'letter-spacing: 3px; font-size: 16px; text-align: center;\'>密碼修改成功</h3>'
                    + '<p style=\'font-size:11px; text-align: center; color: #555;\'>IP 地址：'
                    + ip + 
                    '</p><p style=\'font-size: 12px; text-align: center; color:#CECECF;\'>若此 IP 地址可疑，請修改密碼</p><div>'
        }
        q_sendMail(mailOptions)
        .then(function (info){
            log.info('[Forgot: Send Notify Mail Success]', info.response)
        }, function (err){
            log.error('[Forgot: Send Notify Mail Wrong]', err)
        })
    },
    send_log_email: function (email, title, text, callback){

        var mailOptions = {
            from: '深夜，破曉 <shenyepoxiao@yahoo.com>',
            to: email,
            subject: title,
            text: text
        }
        q_sendMail(mailOptions)
        .then(function (info){
            log.info('[Forgot: Send Log Mail Success]', info.response)
            if (callback){
                callback()
            }
        }, function (err){
            log.error('[Forgot: Send Log Mail Wrong]', err)
        })
    }
}



module.exports = email_helper