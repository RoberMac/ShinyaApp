var api_db_helper = {

    getDateNews: function (user, User, req, res){
        User.findOne({username: user.username}, 'other_info', function (err, found){

            if (err) return err
            if (!found){
                res.status(400).json({'status': 'error', 'msg': '用戶不存在'})            
            } else {
                console.log(found)
                res.send({'status': 'ok', 'msg': found.other_info.news})                
            }

        })
    }
}

module.exports = api_db_helper