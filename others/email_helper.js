var nodemailer        = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
        'user': process.env.YAHOO_USER || '',
        'pass': process.env.YAHOO_PWD || ''
    }
})

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
        transporter.sendMail(mailOptions, function(err, info){
            if (err){
                log.error('[Forgot: SendMail Wrong]', err)
                return err;
            } else {
                log.info('[Forgot: Send Forgot Mail Success]', info.response)
            }
        })
    },
    send_log_email: function (email, title, text, callback){

        var mailOptions = {
            from: '深夜，破曉 <shenyepoxiao@yahoo.com>',
            to: email,
            subject: title,
            text: text
        }
        transporter.sendMail(mailOptions, function(err, info){
            if (err){
                return err;
            } else {
                log.info('[Forgot: Send Error Mail Success]', info.response)
            }
            if (callback){
                callback()
            }
        })
    }
}



module.exports = email_helper