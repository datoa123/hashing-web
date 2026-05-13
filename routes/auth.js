var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/register', function (req, res, next) {
    res.render('register', {message: ""});
});

router.post('/register', async function (req, res, next) {
    try {
        const {email, password, confirmPassword} = req.body;
        if (password.length < 8) {
            return res.render('register', {message: "Password must be at least 8 characters"});
        }
        if (confirmPassword !== password) {
            return res.render('register', {message: "Passwords do not match"});
        }
        const existing = await User.findOne({email})
        if (existing) {
            return res.render('register', {message: "Email already exist"});
        }
        const user = new User({email, password})
        await user.save()
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).json({message: err})
    }
});

router.get('/login', function (req, res, next) {
    res.render('login', {message: ""});
});

router.post('/login', async function (req, res, next) {
    const {email, password} = req.body;
    const foundUser = await User.findOne({email})
    if(!foundUser) {
        return res.render('login', {message: "Invalid Credentials"});
    }
    const match = bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.render('login', {message: "Invalid Credentials"});
    }
    req.session.userId = foundUser._id;
    res.redirect('/dashboard');
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
