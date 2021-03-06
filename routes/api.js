var router = require('express').Router(),
    ejwt   = require('express-jwt'),
    api_db_helper = require('../others/api_db_helper');


// Middleware
router.use(ejwt({secret: key}))

router.post('/getUserInfo', function (req, res, next){

    api_db_helper.getUserInfo(req.body.username, res, next)
})

router.post('/getSelectedDateNews', function (req, res, next){

    api_db_helper.getSelectedDateNews(req.user, req.body, res, next)
})

router.post('/toggleGeoServices', function (req, res, next){

    api_db_helper.toggleGeoServices(req.user, req.body, res, next)
})

router.post('/getGeoServices', function (req, res, next){

    api_db_helper.getGeoServices(req.user, req.body.coords, req.body.countryCode, res, next)
})

module.exports = router