var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/auth');

router.get('/', function (req, res) {
    res.redirect('/auth/login');
});

router.get('/dashboard', isAuthenticated, function (req, res) {
    res.render('dashboard');
});

module.exports = router;
