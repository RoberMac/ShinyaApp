var api_db_helper = {

    getDateNews: function (user, index, User, res, next){
        User.findOne({username: user.username}, 'news', function (err, found){

            if (err) return err
            if (!found){
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})            
            } else {
                if (!!found.news[index]){
                    res.send({'status': 'ok', 'msg': found.news[index]})                    
                } else {
                    next({'code': 400, 'status': 'ok', 'msg': '沒有更多了'})
                }
            }
        })
    }
}

module.exports = api_db_helper