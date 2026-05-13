var express = require('express');
var router = express.Router();
const User = require('../models/User');
const isAuthenticated = require('../middleware/auth');

router.get('/', function (req, res) {
    res.redirect('/auth/login');
});

router.get('/dashboard', async function (req, res, next) {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }

        res.render('dashboard', { email: user.email });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
});

module.exports = router;
