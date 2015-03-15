var router = require('express').Router(),
    ejwt   = require('express-jwt'),
    api_db_helper = require('../others/api_db_helper');


// Middleware
router.use(ejwt({secret: key}))

router.get('/getDateNews', function (req, res){

    api_db_helper.getDateNews(req.user, User, req, res)
})

module.exports = router