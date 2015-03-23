var router = require('express').Router(),
    ejwt   = require('express-jwt'),
    api_db_helper = require('../others/api_db_helper');


// Middleware
router.use(ejwt({secret: key}))

router.post('/getDateNews', function (req, res, next){

    api_db_helper.getDateNews(req.user, req.body.index, User, res, next)
})

router.get('/turnOnGeoServices', function (req, res, next){

    api_db_helper.turnOnGeoServices(req.user, User, res, next)
})

router.get('/turnOffGeoServices', function (req, res, next){

    api_db_helper.turnOffGeoServices(req.user, User, res, next)
})

router.post('/getGeoServices', function (req, res, next){

    api_db_helper.getGeoServices(req.user, req.body.coords, User, res, next)
})

module.exports = router