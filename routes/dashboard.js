var express = require('express');
var router = express.Router();
const User = require('../models/User');

const isAuth = (req, res, next) => {
    if (!req.session.userId){
        return res.redirect('/auth/login');
    }
    next()
}

router.get('/', isAuth ,async function(req, res, next) {
    console.log(req.session.userId)
    const user = await User.findById(req.session.userId);
    res.render('dashboard', {email: user.email || ""});
});

module.exports = router;