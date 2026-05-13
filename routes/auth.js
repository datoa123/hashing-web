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
    const foundUser = await User.findOne({email});
    if (!foundUser) {
        return res.render('login', {message: "Invalid Credentials"});
    }
    const match = await bcrypt.compare(password, foundUser.password); // ← await!
    if (!match) {
        return res.render('login', {message: "Invalid Credentials"});
    }
    req.session.userId = foundUser._id;
    req.session.save(() => {
        res.redirect('/dashboard');
    });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

router.get('/forgotPassword', function (req, res, next) {
    res.render('forgotPassword', { message: "" });
});

router.post('/forgotPassword', async function (req, res, next) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.render('forgotPassword', { message: "No account found with that email" });
        }

        if (newPassword.length < 8) {
            return res.render('forgotPassword', { message: "Password must be at least 8 characters" });
        }
        if (newPassword !== confirmPassword) {
            return res.render('forgotPassword', { message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        foundUser.password = hashedPassword;
        await foundUser.save();

        res.redirect('/auth/login');
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;
