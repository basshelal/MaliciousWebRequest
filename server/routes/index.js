var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (request, response, next) {
    response.render('index');
});
// POST with no params, do not respond!
router.post('/', function (request, response, next) {
    console.log(request.body.data);
    response.sendStatus(200);
});
module.exports = router;
