var express = require('express');
var router = express.Router();
const User = require('../models/User');

router.get('/register', function (req, res, next) {
    res.render('register');
});

router.post('/register', async function (req, res, next) {
    // try {
        const {email, password} = req.body;
        const existing = await User.findOne({email})
        console.log(existing)
        // if (existing) {
        //     console.log("returned existing")
        //     return res.render('register', {message: "Email already exist"});
        // }
        const user = new User({email, password})
        await user.save()
        res.redirect('/auth/login');
    // } catch (err) {
    //     res.status(400).json({message: err})
    // }
});

router.get('/login', function (req, res, next) {
    res.send('login');
});


module.exports = router;
