
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Passport } = require('passport');

// Login Page:
router.get('/login', (req,res) =>{
    res.render('login');
})


// Register Page
router.get('/register', (req,res) =>{
    res.render('register');
})

//Register Handle:
router.post('/register', (req,res) => {
    const {name, email, password, password2 } = req.body
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }

    if(password != password2){
        errors.push({msg : 'Password do not match!'})
    }

    if(password.length < 6){
        errors.push({msg : 'Password should be at least 6 chars'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        User.findOne({email : email})
        .then(user =>{
            if(user){
                errors.push({msg : 'Email is already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                req.flash('succes_msg', 'You can login now');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }

});

router.post('/login', (req,res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/toys/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle:
router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('succes_msg', 'You are logging out');
    res.redirect('/users/login');
})

module.exports = router;