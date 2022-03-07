const User = require('../models/User');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let error = { email: '', password: ' ' };
    if (err.message === "Incorrect email") {
        error.email = "This email is not registered";
    }

    if (err.message === "Incorrect password") {
        error.password = "This password is incorrect";
    }

    if (err.code === 11000) {
        error.email = "that email is already taken";
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

const age = 3 * 24 * 60 * 60;
const webToken = (id) => {
    return jwt.sign({ id }, "akanshu's secret", {
        expiresIn: age
    });
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = webToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: age * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        console.log(err);
        const error = handleErrors(err);
        res.status(400).json({ error });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = webToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: age * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};