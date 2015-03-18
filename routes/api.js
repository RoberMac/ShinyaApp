var router = require('express').Router(),
    ejwt   = require('express-jwt'),
    api_db_helper = require('../others/api_db_helper');


// Middleware
router.use(ejwt({secret: key}))

router.post('/getDateNews', function (req, res, next){

    api_db_helper.getDateNews(req.user, req.body.index, User, res, next)
})

module.exports = router