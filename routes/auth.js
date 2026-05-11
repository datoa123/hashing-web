var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/register', function (req, res) {
    res.render('register', { message: null });
});

router.post('/register', async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('register', { message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.render('register', { message: 'Password must be at least 6 characters' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.render('register', { message: 'Email already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.render('register', { message: 'Something went wrong' });
    }
});

router.get('/login', function (req, res) {
    res.render('login', { message: null });
});

router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        res.render('login', { message: 'Something went wrong' });
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;